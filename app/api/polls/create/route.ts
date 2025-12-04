import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import {
  sanitizePollTitle,
  sanitizePollDescription,
  sanitizeItemName,
  sanitizeItemDescription
} from '@/lib/sanitize';
import { applyRateLimit, getRateLimitHeaders } from '@/lib/middleware/rateLimit';
import { validateImageFile, sanitizeFilename, getFileExtension } from '@/lib/fileValidation';

export async function POST(request: Request) {
  // Apply rate limiting (5 requests per hour)
  const rateLimitResponse = applyRateLimit(request, 'pollCreate');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const supabase = await createClient();

    // 1. Check Authentication
    let user = null;

    // Try Authorization header first (client-side token)
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
    }

    // Fallback to cookies if no user from header
    if (!user) {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in first.' }, { status: 401 });
    }

    // 2. Parse and Sanitize Form Data
    const formData = await request.formData();
    const rawTitle = formData.get('title') as string;
    const rawQuestion = formData.get('question') as string;
    const duration = formData.get('duration') as string;

    // Sanitize inputs to prevent XSS attacks
    const title = sanitizePollTitle(rawTitle);
    const question = sanitizePollDescription(rawQuestion);

    // Validate title (after sanitization)
    if (!title || title.length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Validate question (after sanitization)
    // Note: Length already enforced by sanitization function

    // Validate duration
    if (!['24h', '48h', '1 Week'].includes(duration)) {
      return NextResponse.json({ error: 'Invalid duration. Must be 24h, 48h, or 1 Week' }, { status: 400 });
    }

    // Validate item names early
    const rawItemA_name = formData.get('itemA_name') as string;
    const rawItemB_name = formData.get('itemB_name') as string;

    // Sanitize item names
    const itemA_name = sanitizeItemName(rawItemA_name);
    const itemB_name = sanitizeItemName(rawItemB_name);

    if (!itemA_name || itemA_name.length === 0) {
      return NextResponse.json({ error: 'Item A name is required' }, { status: 400 });
    }
    if (!itemB_name || itemB_name.length === 0) {
      return NextResponse.json({ error: 'Item B name is required' }, { status: 400 });
    }

    // 3. Calculate Closes At
    const now = new Date();
    let closesAt = new Date(now);

    const HOURS_24 = 24;
    const HOURS_48 = 48;
    const DAYS_7 = 7;

    switch (duration) {
      case '48h':
        closesAt.setHours(now.getHours() + HOURS_48);
        break;
      case '1 Week':
        closesAt.setDate(now.getDate() + DAYS_7);
        break;
      case '24h':
      default:
        closesAt.setHours(now.getHours() + HOURS_24);
        break;
    }

    // 4. Create Poll Record in DB
    const { data: poll, error: pollError } = await supabase
      .from('poll')
      .insert({
        owner_id: user.id,
        title,
        description: question,
        duration,
        closes_at: closesAt.toISOString(),
        created_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (pollError) {
      console.error('DB Poll Error:', pollError);
      console.error('Poll Error Code:', pollError.code);
      console.error('Poll Error Details:', pollError.details);
      console.error('Poll Error Hint:', pollError.hint);
      return NextResponse.json({
        error: 'Failed to create poll record',
        details: pollError.message,
        code: pollError.code,
        hint: pollError.hint,
        dbDetails: pollError.details
      }, { status: 500 });
    }

    const pollId = poll.id;
    const items = [];
    const contenders = ['A', 'B'];

    // 5. Process Items & Upload Images
    for (let i = 0; i < contenders.length; i++) {
      const key = contenders[i];
      const rawName = formData.get(`item${key}_name`) as string;
      const rawDesc = formData.get(`item${key}_desc`) as string;
      const price = formData.get(`item${key}_price`) as string;
      const imageFile = formData.get(`item${key}_image`) as File | null;

      // Sanitize item data
      const name = sanitizeItemName(rawName);
      const desc = sanitizeItemDescription(rawDesc);

      let imageUrl = 'https://via.placeholder.com/400?text=No+Image';

      // Upload Image if exists
      if (imageFile && imageFile.size > 0) {
        // Validate image file
        const validation = validateImageFile(imageFile);
        if (!validation.valid) {
          return NextResponse.json({
            error: `Item ${key} image validation failed: ${validation.error}`
          }, { status: 400 });
        }

        try {
          // Sanitize filename to avoid issues
          const fileExt = getFileExtension(imageFile.name);
          const sanitizedFileName = sanitizeFilename(`${Date.now()}-${key}.${fileExt}`);
          const filePath = `${pollId}/${sanitizedFileName}`;

          const { error: uploadError } = await supabase.storage
            .from('poll-images')  // Changed from 'poll_images' to 'poll-images'
            .upload(filePath, imageFile, {
              upsert: true
            });

          if (uploadError) {
            console.error(`Upload Error for ${key}:`, uploadError);
            // Fallback to placeholder if upload fails
          } else {
            const { data } = supabase.storage
              .from('poll-images')
              .getPublicUrl(filePath);
            imageUrl = data.publicUrl;
          }
        } catch (err) {
          console.error(`Storage error for ${key}:`, err);
          // Use placeholder on any error
        }
      }

      items.push({
        poll_id: pollId,
        item_name: name || `Option ${key}`,
        item_description: desc || '',
        price: price ? parseFloat(price) : 0,
        image_url: imageUrl,
        position: i + 1,
      });
    }

    // 6. Insert Poll Items
    const { error: itemsError } = await supabase
      .from('poll_items')
      .insert(items);

    if (itemsError) {
      console.error('DB Items Error:', itemsError);
      // Clean up poll if items fail? For now, we throw to alert user.
      throw new Error('Failed to create poll items');
    }

    return NextResponse.json({ success: true, pollId });

  } catch (error: any) {
    console.error('Create Poll API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
