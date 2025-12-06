import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ownerName, restaurantName } = body;

        const updates: any = {};
        if (ownerName !== undefined) updates.owner_name = ownerName;
        if (restaurantName !== undefined) updates.restaurant_name = restaurantName;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const { error: updateError } = await supabase
            .from('owners')
            .update(updates)
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating owner:', updateError);
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in user update:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
