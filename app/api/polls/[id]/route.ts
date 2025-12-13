// --- Imports ---
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/middleware/rateLimit';

// --- Configuration ---
export const dynamic = 'force-dynamic';

// --- GET Handler ---
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Apply rate limiting (100 requests per hour)
  const rateLimitResponse = applyRateLimit(request, 'pollView');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const supabase = await createClient();
    const { id: pollId } = await params;

    // 1. Fetch Poll Details and Items (without owner join to avoid relationship issues)
    const { data: poll, error: pollError } = await supabase
      .from('poll')
      .select(`
        *,
        items:poll_items(*)
      `)
      .eq('id', pollId)
      .single();

    if (pollError) {
      console.error('Poll fetch error:', pollError);
      console.error('Poll ID:', pollId);
      console.error('Error code:', pollError.code);
      console.error('Error details:', pollError.details);
      console.error('Error hint:', pollError.hint);
      return NextResponse.json({
        error: 'Poll not found',
        details: pollError.message,
        code: pollError.code
      }, { status: 404 });
    }

    if (!poll) {
      console.error('Poll not found for ID:', pollId);
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // 1b. Fetch Owner separately (optional, won't fail if missing)
    let owner = null;
    if (poll.owner_id) {
      const { data: ownerData } = await supabase
        .from('owners')
        .select('*')
        .eq('id', poll.owner_id)
        .single();
      owner = ownerData;
    }

    // 2. Optimized: Fetch Vote Counts using count queries (avoid fetching all vote rows)
    const voteCounts: Record<string, number> = {};
    let totalVotes = 0;

    if (poll.items && poll.items.length > 0) {
      for (const item of poll.items) {
        const { count } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('poll_item_id', item.id);

        const countVal = count || 0;
        voteCounts[item.id] = countVal;
        totalVotes += countVal;
      }
    }

    // 3. Calculate time remaining
    const endsAt = new Date(poll.closes_at);
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const endsIn = diff > 0 ? `${hours}h ${minutes}m` : 'Ended';

    // 4. Format Response
    const formattedData = {
      id: poll.id,
      title: poll.title,
      question: poll.description || 'Which one are you ordering?',
      endsIn,
      totalVotes: totalVotes,
      createdAt: new Date(poll.created_at).getTime(),
      restaurant: {
        name: owner?.restaurant_name || 'Restaurant',
        location: 'Local Area',
        description: 'Helping decide the next menu item!',
        avatar: owner?.restaurant_logo_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&q=80',
        website: owner?.website || '#'
      },
      items: (poll.items || []).map((item: any) => ({
        id: item.id,
        name: item.item_name,
        description: item.item_description || '',
        image: item.image_url,
        price: item.price ? `$${item.price}` : '',
        votes: voteCounts[item.id] || 0
      })).sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
    };

    return NextResponse.json(formattedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    });

  } catch (error: any) {
    console.error('Fetch Poll Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// --- DELETE Handler ---
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { id: pollId } = await params;

    // 1. Check Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify Ownership
    const { data: poll, error: pollError } = await supabase
      .from('poll')
      .select('owner_id')
      .eq('id', pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (poll.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Delete Related Data (Manual Cascade)
    // Delete votes associated with this poll's items
    // First get the item IDs to delete votes for them
    const { data: items } = await supabase
      .from('poll_items')
      .select('id')
      .eq('poll_id', pollId);

    if (items && items.length > 0) {
      const itemIds = items.map(i => i.id);
      await supabase
        .from('votes')
        .delete()
        .in('poll_item_id', itemIds);
    }

    // Delete poll items
    await supabase
      .from('poll_items')
      .delete()
      .eq('poll_id', pollId);

    // 4. Delete Poll
    const { error: deleteError } = await supabase
      .from('poll')
      .delete()
      .eq('id', pollId);

    if (deleteError) {
      console.error('Delete Poll Error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete poll' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete Poll API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
