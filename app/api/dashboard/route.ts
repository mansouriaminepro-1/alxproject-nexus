
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Check Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Polls for Owner with Items
    const { data: polls, error: pollsError } = await supabase
      .from('poll')
      .select(`
        *,
        poll_items (
          image_url
        )
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (pollsError) {
      console.error("Poll fetch error:", pollsError);
      throw new Error("Failed to load polls");
    }

    // 3. Fetch Vote Counts Aggregated from 'votes' table
    const pollIds = polls.map(p => p.id);
    let voteCounts: Record<string, number> = {};

    if (pollIds.length > 0) {
      // Fetch votes for these polls
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('poll_id')
        .in('poll_id', pollIds);
      
      if (!votesError && votesData) {
        votesData.forEach((v: any) => {
          voteCounts[v.poll_id] = (voteCounts[v.poll_id] || 0) + 1;
        });
      }
    }

    // 4. Transform Data for Frontend
    const now = new Date();
    
    const transformedPolls = polls.map((poll) => {
      const closesAt = new Date(poll.closes_at);
      const isActive = poll.is_active && closesAt > now;
      const totalVotes = voteCounts[poll.id] || 0;
      
      let timeLabel = '';
      if (isActive) {
        const diffMs = closesAt.getTime() - now.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        timeLabel = `${hours}h left`;
      } else {
        timeLabel = 'Completed';
      }

      // Safe access to image url
      const coverImage = poll.poll_items && poll.poll_items.length > 0 
        ? poll.poll_items[0].image_url 
        : 'https://via.placeholder.com/400?text=No+Image';

      return {
        id: poll.id,
        title: poll.title,
        status: isActive ? 'Live Now' : 'Completed',
        endsIn: timeLabel,
        totalVotes,
        date: new Date(poll.created_at).toLocaleDateString(),
        image: coverImage,
        winRate: isActive ? 'Leading' : 'Winner', 
      };
    });

    const activePolls = transformedPolls.filter(p => p.status === 'Live Now');
    const historyPolls = transformedPolls.filter(p => p.status === 'Completed');
    
    const totalVotesAllTime = Object.values(voteCounts).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      stats: {
        totalVotes: totalVotesAllTime,
        menuWins: historyPolls.length,
        activeReach: totalVotesAllTime, // Proxy for reach
      },
      activePolls,
      historyPolls
    });

  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
