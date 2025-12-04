'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface CreatePollInput {
    title: string;
    question: string;
    duration: string;
    contenderA: {
        name: string;
        description: string;
        price: string;
        image: string;
    };
    contenderB: {
        name: string;
        description: string;
        price: string;
        image: string;
    };
}

export async function createPollAction(input: CreatePollInput) {
    const supabase = await createClient();

    // 1. Check Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('You must be logged in to create a battle.');
    }

    // 2. Calculate 'closes_at'
    const now = new Date();
    let closesAt = new Date();

    switch (input.duration) {
        case '48h':
            closesAt.setHours(now.getHours() + 48);
            break;
        case '1 Week':
            closesAt.setDate(now.getDate() + 7);
            break;
        case '24h':
        default:
            closesAt.setHours(now.getHours() + 24);
            break;
    }

    // 3. Insert the Poll
    const { data: poll, error: pollError } = await supabase
        .from('poll')
        .insert({
            owner_id: user.id,
            title: input.title,
            description: input.question,
            closes_at: closesAt.toISOString(),
            is_active: true,
        })
        .select('id')
        .single();

    if (pollError) {
        console.error('Error creating poll:', pollError);
        throw new Error('Failed to create battle.');
    }

    // 4. Insert Poll Items
    const itemsToInsert = [
        {
            poll_id: poll.id,
            item_name: input.contenderA.name,
            item_description: input.contenderA.description,
            price: parseFloat(input.contenderA.price) || 0,
            image_url: input.contenderA.image,
            position: 1
        },
        {
            poll_id: poll.id,
            item_name: input.contenderB.name,
            item_description: input.contenderB.description,
            price: parseFloat(input.contenderB.price) || 0,
            image_url: input.contenderB.image,
            position: 2
        }
    ];

    const { error: itemsError } = await supabase
        .from('poll_items')
        .insert(itemsToInsert);

    if (itemsError) {
        console.error('Error creating poll items:', itemsError);
        throw new Error('Failed to add contenders to the battle.');
    }

    revalidatePath('/dashboard');
    redirect(`/poll/${poll.id}`);
}
