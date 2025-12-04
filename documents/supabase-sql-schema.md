# Supabase SQL Schema Definition

This file contains the SQL statements to create all tables and constraints for the MenuFight platform.

## Table Creation Scripts

### 1. Create `owners` Table

```sql
-- Restaurant owner profiles
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_name TEXT NOT NULL,
    owner_name TEXT,
    restaurant_logo_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for owners
CREATE POLICY "Users can view their own owner profile"
    ON public.owners FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own owner profile"
    ON public.owners FOR UPDATE
    USING (auth.uid() = id);

-- Index for performance
CREATE INDEX idx_owners_restaurant_name ON public.owners(restaurant_name);
```

---

### 2. Create `poll` Table

```sql
-- Main poll/battle records
CREATE TABLE IF NOT EXISTS public.poll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT NOT NULL CHECK (duration IN ('24h', '48h', '1 Week')),
    closes_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.poll ENABLE ROW LEVEL SECURITY;

-- RLS Policies for poll
CREATE POLICY "Anyone can view polls"
    ON public.poll FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create polls"
    ON public.poll FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = owner_id);

CREATE POLICY "Owners can update their own polls"
    ON public.poll FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own polls"
    ON public.poll FOR DELETE
    USING (auth.uid() = owner_id);

-- Indexes for performance
CREATE INDEX idx_poll_owner_id ON public.poll(owner_id);
CREATE INDEX idx_poll_created_at ON public.poll(created_at DESC);
CREATE INDEX idx_poll_is_active ON public.poll(is_active);
CREATE INDEX idx_poll_closes_at ON public.poll(closes_at);
```

---

### 3. Create `poll_items` Table

```sql
-- Individual food items within polls
CREATE TABLE IF NOT EXISTS public.poll_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.poll(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT NOT NULL,
    position INTEGER
);

-- Enable Row Level Security
ALTER TABLE public.poll_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for poll_items
CREATE POLICY "Anyone can view poll items"
    ON public.poll_items FOR SELECT
    USING (true);

CREATE POLICY "Poll owners can insert items"
    ON public.poll_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.poll
            WHERE poll.id = poll_items.poll_id
            AND poll.owner_id = auth.uid()
        )
    );

CREATE POLICY "Poll owners can delete items"
    ON public.poll_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.poll
            WHERE poll.id = poll_items.poll_id
            AND poll.owner_id = auth.uid()
        )
    );

-- Indexes for performance
CREATE INDEX idx_poll_items_poll_id ON public.poll_items(poll_id);
CREATE INDEX idx_poll_items_position ON public.poll_items(position);
```

---

### 4. Create `votes` Table

```sql
-- Individual votes on poll items
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.poll(id) ON DELETE CASCADE,
    poll_item_id UUID NOT NULL REFERENCES public.poll_items(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes"
    ON public.votes FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert votes"
    ON public.votes FOR INSERT
    WITH CHECK (true);

-- Unique constraint to prevent duplicate votes from same IP per poll
CREATE UNIQUE INDEX idx_votes_poll_ip ON public.votes(poll_id, ip_address);

-- Indexes for performance
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_poll_item_id ON public.votes(poll_item_id);
CREATE INDEX idx_votes_created_at ON public.votes(created_at DESC);
```

---

## Storage Bucket Setup

### Create `poll-images` Storage Bucket

```sql
-- Create storage bucket for poll item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('poll-images', 'poll-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for poll-images bucket
CREATE POLICY "Public can view poll images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'poll-images');

CREATE POLICY "Authenticated users can upload poll images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'poll-images'
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can update their own poll images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'poll-images'
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can delete their own poll images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'poll-images'
        AND auth.uid() IS NOT NULL
    );
```

---

## Complete Setup Script

Run this script to set up the entire database schema:

```sql
-- ============================================
-- MenuFight Database Schema Setup
-- ============================================

-- 1. Create owners table
CREATE TABLE IF NOT EXISTS public.owners (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_name TEXT NOT NULL,
    owner_name TEXT,
    restaurant_logo_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own owner profile"
    ON public.owners FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own owner profile"
    ON public.owners FOR UPDATE USING (auth.uid() = id);

CREATE INDEX idx_owners_restaurant_name ON public.owners(restaurant_name);

-- 2. Create poll table
CREATE TABLE IF NOT EXISTS public.poll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT NOT NULL CHECK (duration IN ('24h', '48h', '1 Week')),
    closes_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.poll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view polls"
    ON public.poll FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create polls"
    ON public.poll FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = owner_id);

CREATE POLICY "Owners can update their own polls"
    ON public.poll FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own polls"
    ON public.poll FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX idx_poll_owner_id ON public.poll(owner_id);
CREATE INDEX idx_poll_created_at ON public.poll(created_at DESC);
CREATE INDEX idx_poll_is_active ON public.poll(is_active);
CREATE INDEX idx_poll_closes_at ON public.poll(closes_at);

-- 3. Create poll_items table
CREATE TABLE IF NOT EXISTS public.poll_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.poll(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT NOT NULL,
    position INTEGER
);

ALTER TABLE public.poll_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view poll items"
    ON public.poll_items FOR SELECT USING (true);

CREATE POLICY "Poll owners can insert items"
    ON public.poll_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.poll
            WHERE poll.id = poll_items.poll_id
            AND poll.owner_id = auth.uid()
        )
    );

CREATE POLICY "Poll owners can delete items"
    ON public.poll_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.poll
            WHERE poll.id = poll_items.poll_id
            AND poll.owner_id = auth.uid()
        )
    );

CREATE INDEX idx_poll_items_poll_id ON public.poll_items(poll_id);
CREATE INDEX idx_poll_items_position ON public.poll_items(position);

-- 4. Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.poll(id) ON DELETE CASCADE,
    poll_item_id UUID NOT NULL REFERENCES public.poll_items(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes"
    ON public.votes FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes"
    ON public.votes FOR INSERT WITH CHECK (true);

CREATE UNIQUE INDEX idx_votes_poll_ip ON public.votes(poll_id, ip_address);
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_poll_item_id ON public.votes(poll_item_id);
CREATE INDEX idx_votes_created_at ON public.votes(created_at DESC);

-- 5. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('poll-images', 'poll-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view poll images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'poll-images');

CREATE POLICY "Authenticated users can upload poll images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'poll-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own poll images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'poll-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own poll images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'poll-images' AND auth.uid() IS NOT NULL);
```

---

## Migration Notes

> [!IMPORTANT]
> When setting up a new Supabase project, run the complete setup script in the SQL Editor.

> [!WARNING]
> The `owners` table requires the service role key for initial inserts during signup. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment variables.

> [!CAUTION]
> Never expose the service role key in client-side code. It should only be used in server-side API routes.

---

## Verification Queries

After running the setup script, verify the schema with these queries:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('owners', 'poll', 'poll_items', 'votes');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'poll-images';
```
