
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/middleware/rateLimit';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Apply rate limiting (10 requests per hour)
  const rateLimitResponse = applyRateLimit(request, 'vote');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const supabase = await createClient();
    const { id: pollId } = await params;
    const { itemId } = await request.json();

    // Get IP address from multiple sources (more reliable)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = realIp || (forwardedFor ? forwardedFor.split(',')[0] : 'unknown');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Insert vote - database unique constraint prevents duplicates atomically
    // This eliminates race conditions and is more secure than checking first
    const { error } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        poll_item_id: itemId,
        ip_address: ip
      });

    if (error) {
      // Check if it's a duplicate vote (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json({
          error: 'You have already voted in this poll.'
        }, { status: 403 });
      }

      console.error('Vote Insert Error:', error);
      return NextResponse.json({
        error: 'Failed to cast vote'
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Vote API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
