'use server'

import { createClient } from '../../lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function login(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login Error:', error.message);
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password. Please check your credentials.' };
    }
    return { error: error.message };
  }

  if (!data.user) {
    return { error: 'Login succeeded but user data is missing.' };
  }

  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const restaurantName = formData.get('restaurantName') as string;

  if (!email || !password || !restaurantName) {
    return { error: 'All fields are required.' };
  }

  // 1. Create Supabase Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        restaurant_name: restaurantName,
      },
    },
  });

  if (authError) {
    console.error('Signup Auth Error:', authError.message);
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: 'Something went wrong creating the user.' };
  }

  // 2. Insert into 'owners' table using SERVICE ROLE key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (serviceRoleKey) {
    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const { error: dbError } = await adminClient
        .from('owners')
        .upsert({
        id: authData.user.id,
        restaurant_name: restaurantName,
        owner_name: email.split('@')[0],
        created_at: new Date().toISOString(),
        });

    if (dbError) {
        console.error('Database Insert Error (Admin):', dbError);
        return { error: 'Account created but failed to save profile data. Please contact support.' };
    }
  } else {
     const { error: dbError } = await supabase
        .from('owners')
        .upsert({
        id: authData.user.id,
        restaurant_name: restaurantName,
        owner_name: email.split('@')[0],
        created_at: new Date().toISOString(),
        });
        
     if (dbError) {
        console.error('Database Insert Error (Standard):', dbError);
        return { error: 'Account created but failed to save profile data.' };
     }
  }

  return { success: true, session: !!authData.session };
}