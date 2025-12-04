# API Endpoints & Database Queries Reference

This document maps all API endpoints to their database operations for the MenuFight platform.

## Authentication Endpoints

### POST `/api/auth/signup`

**Purpose:** Create a new restaurant owner account

**Database Operations:**
1. Create auth user via `supabase.auth.signUp()`
2. Insert owner profile into `owners` table (using service role key)

**Tables Modified:**
- `auth.users` (via Supabase Auth)
- `owners` (INSERT)

**Query:**
```typescript
await adminClient
  .from('owners')
  .upsert({
    id: authData.user.id,
    restaurant_name: restaurantName,
    owner_name: email.split('@')[0],
    created_at: new Date().toISOString(),
  });
```

**Rate Limit:** 3 requests/hour

---

## Poll Management Endpoints

### POST `/api/polls/create`

**Purpose:** Create a new poll with items and images

**Database Operations:**
1. Verify user authentication
2. Insert poll record
3. Upload images to storage
4. Insert poll items

**Tables Modified:**
- `poll` (INSERT)
- `poll_items` (INSERT)
- `storage.objects` (poll-images bucket)

**Queries:**
```typescript
// 1. Create poll
const { data: poll } = await supabase
  .from('poll')
  .insert({
    owner_id: user.id,
    title,
    description: question,
    duration,
    closes_at: closesAt.toISOString(),
    created_at: new Date().toISOString(),
    is_active: true,
  })
  .select()
  .single();

// 2. Upload images
await supabase.storage
  .from('poll-images')
  .upload(filePath, imageFile, { upsert: true });

// 3. Insert items
await supabase
  .from('poll_items')
  .insert([
    {
      poll_id: pollId,
      item_name: name,
      item_description: desc,
      price: parseFloat(price),
      image_url: imageUrl,
      position: i + 1,
    }
  ]);
```

**Rate Limit:** 5 requests/hour

---

### GET `/api/polls/[id]`

**Purpose:** Fetch poll details with items and vote counts

**Database Operations:**
1. Fetch poll with items
2. Fetch owner information separately
3. Count votes for each item

**Tables Read:**
- `poll` (SELECT with join)
- `poll_items` (SELECT via join)
- `owners` (SELECT)
- `votes` (COUNT)

**Queries:**
```typescript
// 1. Fetch poll and items
const { data: poll } = await supabase
  .from('poll')
  .select(`
    *,
    items:poll_items(*)
  `)
  .eq('id', pollId)
  .single();

// 2. Fetch owner
const { data: ownerData } = await supabase
  .from('owners')
  .select('*')
  .eq('id', poll.owner_id)
  .single();

// 3. Count votes per item
for (const item of poll.items) {
  const { count } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('poll_item_id', item.id);
}
```

**Rate Limit:** 100 requests/hour

---

### DELETE `/api/polls/[id]`

**Purpose:** Delete a poll and all associated data

**Database Operations:**
1. Verify user authentication and ownership
2. Delete votes for poll items
3. Delete poll items
4. Delete poll

**Tables Modified:**
- `votes` (DELETE)
- `poll_items` (DELETE)
- `poll` (DELETE)

**Queries:**
```typescript
// 1. Verify ownership
const { data: poll } = await supabase
  .from('poll')
  .select('owner_id')
  .eq('id', pollId)
  .single();

// 2. Get item IDs
const { data: items } = await supabase
  .from('poll_items')
  .select('id')
  .eq('poll_id', pollId);

// 3. Delete votes
await supabase
  .from('votes')
  .delete()
  .in('poll_item_id', itemIds);

// 4. Delete items
await supabase
  .from('poll_items')
  .delete()
  .eq('poll_id', pollId);

// 5. Delete poll
await supabase
  .from('poll')
  .delete()
  .eq('id', pollId);
```

**Rate Limit:** Inherits from general API limits

---

## Voting Endpoints

### POST `/api/polls/[id]/vote`

**Purpose:** Cast a vote on a poll item

**Database Operations:**
1. Extract voter IP address
2. Insert vote (unique constraint prevents duplicates)

**Tables Modified:**
- `votes` (INSERT)

**Query:**
```typescript
const { error } = await supabase
  .from('votes')
  .insert({
    poll_id: pollId,
    poll_item_id: itemId,
    ip_address: ip
  });

// Error code 23505 = duplicate vote (unique constraint violation)
```

**Rate Limit:** 10 requests/hour

**Error Handling:**
- `23505` error code → "You have already voted in this poll"

---

## Dashboard Endpoints

### GET `/api/dashboard`

**Purpose:** Fetch owner's dashboard data with polls and statistics

**Database Operations:**
1. Verify user authentication
2. Fetch owner profile
3. Fetch all polls with items
4. Fetch all votes for owner's polls
5. Calculate statistics in memory

**Tables Read:**
- `owners` (SELECT)
- `poll` (SELECT with join)
- `poll_items` (SELECT via join)
- `votes` (SELECT)

**Queries:**
```typescript
// 1. Fetch owner
const { data: owner } = await supabase
  .from('owners')
  .select('*')
  .eq('id', user.id)
  .single();

// 2. Fetch polls with items
const { data: polls } = await supabase
  .from('poll')
  .select(`
    *,
    poll_items (
      id,
      item_name,
      image_url
    )
  `)
  .eq('owner_id', user.id)
  .order('created_at', { ascending: false });

// 3. Fetch all votes (optimized single query)
const { data: allVotes } = await supabase
  .from('votes')
  .select('poll_id, poll_item_id, ip_address')
  .in('poll_id', pollIds);

// 4. Aggregate in memory
allVotes.forEach(vote => {
  voteCounts[vote.poll_id] = (voteCounts[vote.poll_id] || 0) + 1;
  itemVoteCounts[vote.poll_item_id] = (itemVoteCounts[vote.poll_item_id] || 0) + 1;
});
```

**Rate Limit:** 60 requests/hour

**Performance Optimization:**
- Single query to fetch all votes instead of N+1 queries
- In-memory aggregation for vote counts and percentages
- Unique IP calculation using Set

---

## Server Actions

### `deletePoll(pollId)`

**Location:** `app/actions/polls.ts`

**Database Operations:**
1. Verify authentication
2. Verify ownership
3. Delete poll items and votes
4. Delete poll

**Tables Modified:**
- `poll` (SELECT, DELETE)
- `poll_items` (DELETE)
- `votes` (DELETE)

**Queries:**
```typescript
// 1. Verify ownership
const { data: poll } = await supabase
  .from('poll')
  .select('owner_id')
  .eq('id', pollId)
  .single();

// 2. Get items
const { data: items } = await supabase
  .from('poll_items')
  .select('id')
  .eq('poll_id', pollId);

// 3. Delete votes
await supabase
  .from('votes')
  .delete()
  .in('poll_item_id', itemIds);

// 4. Delete items
await supabase
  .from('poll_items')
  .delete()
  .eq('poll_id', pollId);

// 5. Delete poll
await supabase
  .from('poll')
  .delete()
  .eq('id', pollId);
```

---

## Query Patterns & Best Practices

### Optimized Vote Counting

**❌ Bad (N+1 queries):**
```typescript
for (const poll of polls) {
  const { count } = await supabase
    .from('votes')
    .select('*', { count: 'exact' })
    .eq('poll_id', poll.id);
}
```

**✅ Good (Single query + in-memory aggregation):**
```typescript
const { data: allVotes } = await supabase
  .from('votes')
  .select('poll_id, poll_item_id')
  .in('poll_id', pollIds);

const voteCounts = {};
allVotes.forEach(vote => {
  voteCounts[vote.poll_id] = (voteCounts[vote.poll_id] || 0) + 1;
});
```

---

### Handling Missing Relationships

**Pattern:** Fetch related data separately to avoid join failures

```typescript
// Fetch poll first
const { data: poll } = await supabase
  .from('poll')
  .select('*, items:poll_items(*)')
  .eq('id', pollId)
  .single();

// Fetch owner separately (won't fail if missing)
let owner = null;
if (poll.owner_id) {
  const { data: ownerData } = await supabase
    .from('owners')
    .select('*')
    .eq('id', poll.owner_id)
    .single();
  owner = ownerData;
}
```

---

### Duplicate Prevention

**Pattern:** Use database unique constraints instead of check-then-insert

```typescript
// ❌ Bad (race condition)
const existing = await supabase
  .from('votes')
  .select('*')
  .eq('poll_id', pollId)
  .eq('ip_address', ip)
  .single();

if (!existing) {
  await supabase.from('votes').insert({ ... });
}

// ✅ Good (atomic operation)
const { error } = await supabase
  .from('votes')
  .insert({ poll_id: pollId, ip_address: ip });

if (error?.code === '23505') {
  // Handle duplicate
}
```

---

## Common Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| `23505` | Unique constraint violation | Duplicate vote from same IP |
| `23503` | Foreign key violation | Referenced record doesn't exist |
| `42501` | Insufficient privilege | RLS policy blocking access |
| `PGRST116` | No rows returned | Record not found (single query) |

---

## Performance Monitoring

**Slow Query Indicators:**
- N+1 query patterns (multiple queries in loops)
- Missing indexes on foreign keys
- Large result sets without pagination

**Optimization Checklist:**
- ✅ Use `.select()` to fetch only needed columns
- ✅ Use `.count('exact', { head: true })` for count-only queries
- ✅ Batch related queries when possible
- ✅ Implement caching with `Cache-Control` headers
- ✅ Use database indexes on frequently queried columns
