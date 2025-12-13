# MenuFight Database Documentation

This directory contains comprehensive documentation for the MenuFight platform's Supabase database schema and data architecture.

## 📚 Documentation Files

### 1. [supabase-schema.md](./supabase-schema.md)
**Complete Database Schema Overview**

- All database tables with column definitions
- Entity relationships and foreign keys
- Storage bucket configuration
- Row Level Security (RLS) policies
- Entity Relationship Diagram (ERD)
- Indexing recommendations
- Data sanitization rules
- Rate limiting configuration

**Use this when:** You need to understand the overall database structure, relationships between tables, or security policies.

---

### 2. [supabase-sql-schema.md](./supabase-sql-schema.md)
**SQL Schema Definition & Setup Scripts**

- Complete SQL table creation scripts
- RLS policy definitions
- Index creation statements
- Storage bucket setup
- Complete setup script for new projects
- Migration notes and warnings
- Verification queries

**Use this when:** Setting up a new Supabase project, creating migrations, or verifying database schema.

---

### 3. [api-database-reference.md](./api-database-reference.md)
**API Endpoints & Database Operations**

- All API endpoints mapped to database queries
- Query patterns and examples
- Performance optimization techniques
- Common error codes and handling
- Best practices for database operations
- N+1 query prevention strategies

**Use this when:** Implementing new API endpoints, debugging database queries, or optimizing performance.

---

### 4. [data-types.md](./data-types.md)
**TypeScript Interfaces & Types**

- Database entity types
- Frontend display types
- API request/response types
- Utility types and type guards
- Type usage examples
- Computation logic for derived fields

**Use this when:** Writing TypeScript code, defining new types, or understanding data transformations.

---

### 5. [challenges_solutions.md](./challenges_solutions.md)
**🛠 Challenges, Solutions & Best Practices**

- Design challenges (Food vs. Tech)
- Database & Security learning curve
- Backend efficiency & Deployment steps
- Vote integrity solutions

**Use this when:** Reviewing the project's development journey and technical decisions.

---

## 🗂️ Database Tables Overview

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `owners` | Restaurant owner profiles | → `poll` (one-to-many) |
| `poll` | Poll/battle records | ← `owners`, → `poll_items`, → `votes` |
| `poll_items` | Food items in polls | ← `poll`, → `votes` |
| `votes` | Individual votes | ← `poll`, ← `poll_items` |

**Storage Bucket:** `poll-images` (public access for poll item images)

---

## 🔑 Key Concepts

### Authentication Flow
1. User signs up via Supabase Auth
2. Owner profile created in `owners` table (using service role key)
3. User ID synchronized between `auth.users` and `owners`

### Poll Creation Flow
1. Authenticated user creates poll
2. Images uploaded to `poll-images` storage
3. Poll items created with image URLs
4. Poll becomes active and votable

### Voting Flow
1. IP address extracted from request
2. Vote inserted with unique constraint check
3. Duplicate votes prevented at database level
4. Vote counts aggregated for display

### Data Security
- **RLS Policies:** Enforce data access rules
- **Input Sanitization:** Prevent XSS attacks
- **Rate Limiting:** Prevent abuse
- **Service Role Key:** Used only for owner creation during signup

---

## 🚀 Quick Start

### Setting Up a New Database

1. Open Supabase SQL Editor
2. Copy the complete setup script from [supabase-sql-schema.md](./supabase-sql-schema.md)
3. Run the script to create all tables, indexes, and policies
4. Verify setup using the verification queries

### Adding a New Feature

1. **Design:** Update schema in [supabase-schema.md](./supabase-schema.md)
2. **Implement:** Write SQL migration in [supabase-sql-schema.md](./supabase-sql-schema.md)
3. **Code:** Add API endpoint and queries in [api-database-reference.md](./api-database-reference.md)
4. **Types:** Define TypeScript types in [data-types.md](./data-types.md)

---

## 📊 Database Statistics

**Current Schema:**
- **Tables:** 4 (owners, poll, poll_items, votes)
- **Storage Buckets:** 1 (poll-images)
- **Indexes:** 10+ (for performance optimization)
- **RLS Policies:** 15+ (for security)

**Relationships:**
- 3 foreign key relationships
- 1 unique constraint (vote deduplication)
- Cascade delete handling (manual in code)

---

## 🔍 Common Queries

### Get All Active Polls
```sql
SELECT * FROM poll 
WHERE is_active = true 
AND closes_at > NOW()
ORDER BY created_at DESC;
```

### Get Vote Count for a Poll
```sql
SELECT COUNT(*) FROM votes 
WHERE poll_id = 'your-poll-id';
```

### Get Unique Voters
```sql
SELECT COUNT(DISTINCT ip_address) FROM votes 
WHERE poll_id = 'your-poll-id';
```

### Get Poll with Items and Votes
```sql
SELECT 
  p.*,
  pi.id as item_id,
  pi.item_name,
  COUNT(v.id) as vote_count
FROM poll p
LEFT JOIN poll_items pi ON pi.poll_id = p.id
LEFT JOIN votes v ON v.poll_item_id = pi.id
WHERE p.id = 'your-poll-id'
GROUP BY p.id, pi.id;
```

---

## ⚠️ Important Notes

> [!IMPORTANT]
> **Service Role Key:** Only use in server-side API routes. Never expose in client code.

> [!WARNING]
> **Manual Cascade Deletes:** When deleting polls, manually delete votes and poll_items first to avoid foreign key violations.

> [!CAUTION]
> **RLS Policies:** Test all policies thoroughly. Incorrect policies can expose sensitive data or block legitimate access.

---

## 🛠️ Maintenance

### Regular Tasks
- Monitor slow queries and add indexes as needed
- Review RLS policies for security
- Clean up old completed polls (if implementing archival)
- Monitor storage bucket size

### Performance Optimization
- Use single queries with aggregation instead of N+1 patterns
- Implement caching for frequently accessed data
- Add indexes on columns used in WHERE clauses
- Use `count('exact', { head: true })` for count-only queries

---

## 📞 Support

For questions or issues related to the database schema:
1. Check the relevant documentation file above
2. Review the ERD in [supabase-schema.md](./supabase-schema.md)
3. Look for similar patterns in [api-database-reference.md](./api-database-reference.md)
4. Verify types in [data-types.md](./data-types.md)

---

## 📝 Contributing

When updating the database schema:
1. Update all 4 documentation files to maintain consistency
2. Add migration scripts to [supabase-sql-schema.md](./supabase-sql-schema.md)
3. Update the ERD diagram if relationships change
4. Add new types to [data-types.md](./data-types.md)
5. Document new API queries in [api-database-reference.md](./api-database-reference.md)

---

**Last Updated:** December 4, 2025  
**Schema Version:** 1.0  
**Database:** Supabase PostgreSQL
