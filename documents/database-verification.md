# Database Verification Guide

This guide will help you verify that your Supabase database is correctly set up according to the MenuFight schema.

---

## 🔍 Step 1: Check All Tables Exist

Run this query in your **Supabase SQL Editor**:

```sql
-- Check if all required tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY table_name;
```

**Expected Result:** You should see 4 rows:
- `owners`
- `poll`
- `poll_items`
- `votes`

---

## 🔍 Step 2: Verify Table Columns

### Check `owners` table columns:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'owners'
ORDER BY ordinal_position;
```

**Expected Columns:**
- `id` (uuid, NOT NULL)
- `restaurant_name` (text, NOT NULL)
- `owner_name` (text, nullable)
- `restaurant_logo_url` (text, nullable)
- `website` (text, nullable)
- `created_at` (timestamp, NOT NULL)

---

### Check `poll` table columns:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'poll'
ORDER BY ordinal_position;
```

**Expected Columns:**
- `id` (uuid, NOT NULL)
- `owner_id` (uuid, NOT NULL)
- `title` (text, NOT NULL)
- `description` (text, nullable)
- `duration` (text, NOT NULL)
- `closes_at` (timestamp, NOT NULL)
- `created_at` (timestamp, NOT NULL)
- `is_active` (boolean, default true)

---

### Check `poll_items` table columns:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'poll_items'
ORDER BY ordinal_position;
```

**Expected Columns:**
- `id` (uuid, NOT NULL)
- `poll_id` (uuid, NOT NULL)
- `item_name` (text, NOT NULL)
- `item_description` (text, nullable)
- `price` (numeric/decimal, nullable)
- `image_url` (text, NOT NULL)
- `position` (integer, nullable)

---

### Check `votes` table columns:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'votes'
ORDER BY ordinal_position;
```

**Expected Columns:**
- `id` (uuid, NOT NULL)
- `poll_id` (uuid, NOT NULL)
- `poll_item_id` (uuid, NOT NULL)
- `ip_address` (text, NOT NULL)
- `created_at` (timestamp, default NOW())

---

## 🔍 Step 3: Verify Foreign Keys

```sql
-- Check all foreign key constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY tc.table_name, kcu.column_name;
```

**Expected Foreign Keys:**
1. `owners.id` → `auth.users.id`
2. `poll.owner_id` → `owners.id`
3. `poll_items.poll_id` → `poll.id`
4. `votes.poll_id` → `poll.id`
5. `votes.poll_item_id` → `poll_items.id`

---

## 🔍 Step 4: Verify Unique Constraints

```sql
-- Check unique constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY tc.table_name;
```

**Expected Unique Constraint:**
- `votes` table: `(poll_id, ip_address)` - Prevents duplicate votes

---

## 🔍 Step 5: Verify Indexes

```sql
-- Check all indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY tablename, indexname;
```

**Expected Indexes (minimum):**
- `idx_poll_owner_id` on `poll(owner_id)`
- `idx_poll_created_at` on `poll(created_at)`
- `idx_poll_is_active` on `poll(is_active)`
- `idx_poll_closes_at` on `poll(closes_at)`
- `idx_poll_items_poll_id` on `poll_items(poll_id)`
- `idx_votes_poll_id` on `votes(poll_id)`
- `idx_votes_poll_item_id` on `votes(poll_item_id)`
- `idx_votes_poll_ip` on `votes(poll_id, ip_address)` (UNIQUE)

---

## 🔍 Step 6: Verify RLS is Enabled

```sql
-- Check if Row Level Security is enabled
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY tablename;
```

**Expected Result:** All tables should have `rowsecurity = true`

---

## 🔍 Step 7: Check RLS Policies

```sql
-- List all RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY tablename, policyname;
```

**Expected Policies (minimum):**

**owners:**
- SELECT policy (users can view own profile)
- UPDATE policy (users can update own profile)

**poll:**
- SELECT policy (public read)
- INSERT policy (authenticated users)
- UPDATE policy (owners only)
- DELETE policy (owners only)

**poll_items:**
- SELECT policy (public read)
- INSERT policy (via poll ownership)
- DELETE policy (via poll ownership)

**votes:**
- SELECT policy (public read)
- INSERT policy (public write)

---

## 🔍 Step 8: Check Storage Bucket

```sql
-- Check if poll-images bucket exists
SELECT 
    id,
    name,
    public
FROM storage.buckets
WHERE id = 'poll-images';
```

**Expected Result:**
- `id`: `poll-images`
- `name`: `poll-images`
- `public`: `true`

---

## 🔍 Step 9: Check Storage Policies

```sql
-- Check storage bucket policies
SELECT
    name,
    definition
FROM storage.policies
WHERE bucket_id = 'poll-images'
ORDER BY name;
```

**Expected Policies:**
- SELECT policy (public can view)
- INSERT policy (authenticated users)
- UPDATE policy (authenticated users)
- DELETE policy (authenticated users)

---

## 🔍 Step 10: Verify Check Constraints

```sql
-- Check for CHECK constraints (like duration validation)
SELECT
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.table_name IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY tc.table_name;
```

**Expected Check Constraint:**
- `poll.duration` should have CHECK constraint: `duration IN ('24h', '48h', '1 Week')`

---

## ✅ Complete Verification Script

Run this **all-in-one** script to get a complete overview:

```sql
-- ============================================
-- COMPLETE DATABASE VERIFICATION SCRIPT
-- ============================================

-- 1. Tables
SELECT '=== TABLES ===' as section;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY table_name;

-- 2. Column Counts
SELECT '=== COLUMN COUNTS ===' as section;
SELECT 
    table_name,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name IN ('owners', 'poll', 'poll_items', 'votes')
GROUP BY table_name
ORDER BY table_name;

-- 3. Foreign Keys Count
SELECT '=== FOREIGN KEYS ===' as section;
SELECT COUNT(*) as foreign_key_count
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public'
AND table_name IN ('owners', 'poll', 'poll_items', 'votes');

-- 4. Indexes Count
SELECT '=== INDEXES ===' as section;
SELECT 
    tablename,
    COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('owners', 'poll', 'poll_items', 'votes')
GROUP BY tablename
ORDER BY tablename;

-- 5. RLS Status
SELECT '=== RLS STATUS ===' as section;
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('owners', 'poll', 'poll_items', 'votes')
ORDER BY tablename;

-- 6. RLS Policies Count
SELECT '=== RLS POLICIES ===' as section;
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('owners', 'poll', 'poll_items', 'votes')
GROUP BY tablename
ORDER BY tablename;

-- 7. Storage Bucket
SELECT '=== STORAGE BUCKET ===' as section;
SELECT id, name, public FROM storage.buckets WHERE id = 'poll-images';

-- 8. Summary
SELECT '=== SUMMARY ===' as section;
SELECT 
    'Tables' as metric,
    COUNT(DISTINCT table_name)::text as value
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('owners', 'poll', 'poll_items', 'votes')
UNION ALL
SELECT 
    'Foreign Keys',
    COUNT(*)::text
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public'
AND table_name IN ('owners', 'poll', 'poll_items', 'votes')
UNION ALL
SELECT 
    'Indexes',
    COUNT(*)::text
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('owners', 'poll', 'poll_items', 'votes')
UNION ALL
SELECT 
    'RLS Policies',
    COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('owners', 'poll', 'poll_items', 'votes');
```

---

## 📋 Expected Results Summary

| Metric | Expected Value |
|--------|----------------|
| **Tables** | 4 |
| **Foreign Keys** | 5 |
| **Indexes** | 10+ |
| **RLS Policies** | 10+ |
| **Storage Buckets** | 1 |
| **Unique Constraints** | 1 (votes) |
| **Check Constraints** | 1 (poll.duration) |

---

## 🔧 What to Do After Running Verification

### ✅ If Everything Matches:
Your database is correctly set up! No action needed.

### ❌ If Something is Missing:

1. **Missing Tables:** Run the setup script from `supabase-sql-schema.md`
2. **Missing Indexes:** Add them using the index creation scripts
3. **Missing RLS Policies:** Enable RLS and add policies from the schema file
4. **Missing Storage Bucket:** Create it in Supabase Dashboard → Storage
5. **Missing Foreign Keys:** Add them using ALTER TABLE statements

---

## 🚨 Common Issues & Fixes

### Issue: `owners` table doesn't exist
**Fix:** Run the owners table creation script from `supabase-sql-schema.md`

### Issue: Foreign key constraint fails
**Fix:** Ensure parent tables exist before creating child tables

### Issue: RLS is not enabled
**Fix:** Run `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

### Issue: Storage bucket doesn't exist
**Fix:** Create it in Supabase Dashboard or run storage bucket SQL

### Issue: Unique constraint missing on votes
**Fix:** Run:
```sql
CREATE UNIQUE INDEX idx_votes_poll_ip ON votes(poll_id, ip_address);
```

---

## 📞 Next Steps

1. Run the **Complete Verification Script** above
2. Compare results with **Expected Results Summary**
3. Note any missing items
4. Run the appropriate fix scripts from `supabase-sql-schema.md`
5. Re-run verification to confirm

**Need help?** Check the `supabase-sql-schema.md` file for complete setup scripts!
