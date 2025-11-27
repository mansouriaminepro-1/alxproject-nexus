
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const pollId = params.id;
    const { itemId } = await request.json();

    if (!itemId) {
        return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // 1. Insert Vote into 'votes' table
    const { error } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        poll_item_id: itemId,
      });

    if (error) {
      console.error('Vote Insert Error:', error);
      return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Vote API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
