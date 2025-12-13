// --- Imports ---
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/middleware/rateLimit';

// --- POST Handler ---
export async function POST(request: Request) {
  // Apply rate limiting (3 requests per hour)
  const rateLimitResponse = applyRateLimit(request, 'signup');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const userName = formData.get('userName') as string;

    if (!email || !password || !userName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          owner_name: userName,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User creation failed.' }, { status: 500 });
    }

    // 2. Insert into 'owners' table using SERVICE ROLE key to bypass RLS/Auth issues during signup
    // ⚠️ SECURITY: This key bypasses RLS. Must ONLY be used in server-side API routes.
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
          restaurant_name: 'My Restaurant',
          owner_name: userName,
          created_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('Owner Creation Error:', dbError);
        // Don't fail the whole request if only the profile fails, but log it
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
