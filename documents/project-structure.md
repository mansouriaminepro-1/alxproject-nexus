# MenuFight Project Structure

## 📁 File Structure

```
menufight V2/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 actions/                  # Server Actions
│   │   ├── auth.ts                  # Authentication actions
│   │   └── polls.ts                 # Poll management actions
│   │
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 auth/
│   │   │   └── 📁 signup/
│   │   │       └── route.ts         # POST /api/auth/signup
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   └── route.ts             # GET /api/dashboard
│   │   │
│   │   └── 📁 polls/
│   │       ├── 📁 [id]/
│   │       │   ├── route.ts         # GET, DELETE /api/polls/[id]
│   │       │   └── 📁 vote/
│   │       │       └── route.ts     # POST /api/polls/[id]/vote
│   │       └── 📁 create/
│   │           └── route.ts         # POST /api/polls/create
│   │
│   ├── 📁 create-poll/
│   │   └── page.tsx                 # Poll creation page
│   │
│   ├── 📁 dashboard/
│   │   └── page.tsx                 # Owner dashboard page
│   │
│   ├── 📁 vote/
│   │   └── 📁 [id]/
│   │       └── page.tsx             # Voting page
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
│
├── 📁 components/                   # React Components
│   ├── 📁 commons/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── UnifiedNavbar.tsx
│   │
│   ├── 📁 dashboard/
│   │   ├── DashboardNavbar.tsx
│   │   └── 📁 tabs/
│   │       ├── ActiveTab.tsx
│   │       ├── HistoryTab.tsx
│   │       └── SettingsTab.tsx
│   │
│   ├── 📁 forms/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   │
│   ├── 📁 home/
│   │   ├── CTASection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   └── TestimonialsSection.tsx
│   │
│   └── 📁 vote/
│       ├── PollCard.tsx
│       ├── ShareSection.tsx
│       └── VoteConfirmation.tsx
│
├── 📁 config/
│   └── site.ts                      # Site configuration
│
├── 📁 documents/                    # 📚 Documentation
│   ├── README.md                    # Documentation index
│   ├── api-database-reference.md   # API & database queries
│   ├── data-types.md               # TypeScript types
│   ├── supabase-schema.md          # Schema overview
│   └── supabase-sql-schema.md      # SQL setup scripts
│
├── 📁 lib/                          # Utility Libraries
│   ├── 📁 middleware/
│   │   └── rateLimit.ts            # Rate limiting
│   │
│   ├── 📁 supabase/
│   │   └── server.ts               # Server-side Supabase client
│   │
│   ├── fileValidation.ts           # File upload validation
│   ├── sanitize.ts                 # Input sanitization
│   └── supabase.ts                 # Client-side Supabase client
│
├── 📁 styles/
│   └── globals.css                 # Global styles
│
├── 📁 types/                        # TypeScript Types
│   ├── api.ts                      # API types
│   ├── index.ts                    # UI types
│   └── poll.ts                     # Poll types
│
├── .env.local                      # Environment variables
├── .gitignore
├── middleware.ts                   # Next.js middleware
├── next.config.mjs                 # Next.js configuration
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── PERFORMANCE_FIXES.md
```

---

## 🗄️ Database Table Structure

### Visual Schema

```
┌─────────────────────┐
│      auth.users     │ (Supabase Auth)
│  ─────────────────  │
│  • id (UUID) PK     │
│  • email            │
│  • encrypted_pass   │
└──────────┬──────────┘
           │
           │ references
           ▼
┌─────────────────────────────────┐
│           owners                │
│  ─────────────────────────────  │
│  • id (UUID) PK, FK             │◄─────┐
│  • restaurant_name (TEXT)       │      │
│  • owner_name (TEXT)            │      │
│  • restaurant_logo_url (TEXT)   │      │
│  • website (TEXT)               │      │
│  • created_at (TIMESTAMP)       │      │
└─────────────────────────────────┘      │
                                         │
                                         │ owner_id
                                         │
┌─────────────────────────────────┐      │
│            poll                 │      │
│  ─────────────────────────────  │      │
│  • id (UUID) PK                 │      │
│  • owner_id (UUID) FK           │──────┘
│  • title (TEXT)                 │
│  • description (TEXT)           │
│  • duration (TEXT)              │
│  • closes_at (TIMESTAMP)        │
│  • created_at (TIMESTAMP)       │
│  • is_active (BOOLEAN)          │
└──────────┬──────────────────────┘
           │
           │ poll_id
           ▼
┌─────────────────────────────────┐
│         poll_items              │
│  ─────────────────────────────  │
│  • id (UUID) PK                 │◄─────┐
│  • poll_id (UUID) FK            │      │
│  • item_name (TEXT)             │      │
│  • item_description (TEXT)      │      │
│  • price (DECIMAL)              │      │
│  • image_url (TEXT)             │      │
│  • position (INTEGER)           │      │
└─────────────────────────────────┘      │
                                         │
                                         │ poll_item_id
                                         │
┌─────────────────────────────────┐      │
│           votes                 │      │
│  ─────────────────────────────  │      │
│  • id (UUID) PK                 │      │
│  • poll_id (UUID) FK            │      │
│  • poll_item_id (UUID) FK       │──────┘
│  • ip_address (TEXT)            │
│  • created_at (TIMESTAMP)       │
│                                 │
│  UNIQUE(poll_id, ip_address)    │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Storage: poll-images (bucket)  │
│  ─────────────────────────────  │
│  • Public access enabled        │
│  • Path: {pollId}/{file}        │
└─────────────────────────────────┘
```

---

## 📊 Detailed Table Schemas

### 1. `owners` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, FK → auth.users(id) | User ID from Supabase Auth |
| `restaurant_name` | TEXT | NOT NULL | Restaurant name |
| `owner_name` | TEXT | | Owner display name |
| `restaurant_logo_url` | TEXT | | Logo image URL |
| `website` | TEXT | | Restaurant website |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation time |

**Relationships:**
- `id` → `auth.users(id)` (one-to-one)
- `id` ← `poll.owner_id` (one-to-many)

---

### 2. `poll` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Poll identifier |
| `owner_id` | UUID | FK → owners(id), NOT NULL | Poll creator |
| `title` | TEXT | NOT NULL | Poll title |
| `description` | TEXT | | Poll question |
| `duration` | TEXT | NOT NULL, CHECK IN ('24h','48h','1 Week') | Duration option |
| `closes_at` | TIMESTAMP | NOT NULL | Closing timestamp |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |
| `is_active` | BOOLEAN | DEFAULT true | Active status |

**Relationships:**
- `owner_id` → `owners(id)` (many-to-one)
- `id` ← `poll_items.poll_id` (one-to-many)
- `id` ← `votes.poll_id` (one-to-many)

**Indexes:**
- `idx_poll_owner_id` on `owner_id`
- `idx_poll_created_at` on `created_at DESC`
- `idx_poll_is_active` on `is_active`
- `idx_poll_closes_at` on `closes_at`

---

### 3. `poll_items` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Item identifier |
| `poll_id` | UUID | FK → poll(id), NOT NULL | Parent poll |
| `item_name` | TEXT | NOT NULL | Food item name |
| `item_description` | TEXT | | Item description |
| `price` | DECIMAL(10,2) | | Item price |
| `image_url` | TEXT | NOT NULL | Image URL |
| `position` | INTEGER | | Display order (1 or 2) |

**Relationships:**
- `poll_id` → `poll(id)` (many-to-one)
- `id` ← `votes.poll_item_id` (one-to-many)

**Indexes:**
- `idx_poll_items_poll_id` on `poll_id`
- `idx_poll_items_position` on `position`

---

### 4. `votes` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Vote identifier |
| `poll_id` | UUID | FK → poll(id), NOT NULL | Poll reference |
| `poll_item_id` | UUID | FK → poll_items(id), NOT NULL | Voted item |
| `ip_address` | TEXT | NOT NULL | Voter IP |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Vote timestamp |

**Unique Constraint:**
- `UNIQUE(poll_id, ip_address)` - One vote per IP per poll

**Relationships:**
- `poll_id` → `poll(id)` (many-to-one)
- `poll_item_id` → `poll_items(id)` (many-to-one)

**Indexes:**
- `idx_votes_poll_id` on `poll_id`
- `idx_votes_poll_item_id` on `poll_item_id`
- `idx_votes_created_at` on `created_at DESC`
- `idx_votes_poll_ip` on `(poll_id, ip_address)` UNIQUE

---

## 🔐 Row Level Security (RLS) Policies

### `owners` Table
```sql
-- SELECT: Users can view their own profile
auth.uid() = id

-- UPDATE: Users can update their own profile
auth.uid() = id
```

### `poll` Table
```sql
-- SELECT: Anyone can view polls
true

-- INSERT: Authenticated users only
auth.uid() IS NOT NULL AND auth.uid() = owner_id

-- UPDATE: Owners only
auth.uid() = owner_id

-- DELETE: Owners only
auth.uid() = owner_id
```

### `poll_items` Table
```sql
-- SELECT: Anyone can view items
true

-- INSERT: Poll owners only (via join)
EXISTS (SELECT 1 FROM poll WHERE poll.id = poll_items.poll_id AND poll.owner_id = auth.uid())

-- DELETE: Poll owners only (via join)
EXISTS (SELECT 1 FROM poll WHERE poll.id = poll_items.poll_id AND poll.owner_id = auth.uid())
```

### `votes` Table
```sql
-- SELECT: Anyone can view votes
true

-- INSERT: Anyone can vote
true
```

---

## 🗂️ Storage Buckets

### `poll-images` Bucket

**Configuration:**
- **Public:** Yes
- **File size limit:** Validated in code
- **Allowed types:** Images only

**Path Structure:**
```
poll-images/
└── {poll_id}/
    ├── {timestamp}-A.{ext}
    └── {timestamp}-B.{ext}
```

**Example:**
```
poll-images/550e8400-e29b-41d4-a716-446655440000/1701234567890-A.jpg
```

**Policies:**
```sql
-- SELECT: Public read
bucket_id = 'poll-images'

-- INSERT: Authenticated users
bucket_id = 'poll-images' AND auth.uid() IS NOT NULL

-- UPDATE/DELETE: Authenticated users
bucket_id = 'poll-images' AND auth.uid() IS NOT NULL
```

---

## 🔄 Data Flow Diagrams

### Poll Creation Flow
```
User (Authenticated)
    │
    ▼
POST /api/polls/create
    │
    ├─► Validate input
    ├─► Insert into `poll` table
    ├─► Upload images to `poll-images` bucket
    ├─► Insert into `poll_items` table (2 items)
    │
    ▼
Return poll ID
```

### Voting Flow
```
User (Anonymous)
    │
    ▼
POST /api/polls/[id]/vote
    │
    ├─► Extract IP address
    ├─► Insert into `votes` table
    │   │
    │   ├─► Success: Return 200
    │   └─► Error 23505: Already voted (409)
    │
    ▼
Return response
```

### Dashboard Data Flow
```
Owner (Authenticated)
    │
    ▼
GET /api/dashboard
    │
    ├─► Fetch from `owners` table
    ├─► Fetch from `poll` table (with join to poll_items)
    ├─► Fetch from `votes` table (all votes for owner's polls)
    ├─► Aggregate in memory:
    │   ├─► Vote counts per poll
    │   ├─► Vote counts per item
    │   ├─► Percentages
    │   └─► Unique IPs
    │
    ▼
Return dashboard data
```

---

## 📦 Key Dependencies

### Core Framework
- **Next.js 14+** - App Router
- **React 18+** - UI framework
- **TypeScript** - Type safety

### Database & Auth
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Row Level Security

### Utilities
- **Rate limiting** - Custom implementation
- **Input sanitization** - XSS prevention
- **File validation** - Image upload security

---

## 🎯 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!WARNING]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code!

---

## 📈 Scalability Considerations

### Current Optimizations
- ✅ Single query aggregation for votes
- ✅ Database indexes on foreign keys
- ✅ Unique constraints for data integrity
- ✅ Rate limiting on all endpoints
- ✅ Caching headers on poll data

### Future Improvements
- 📌 Implement pagination for polls
- 📌 Add database views for common queries
- 📌 Consider Redis for vote counting
- 📌 Archive old completed polls
- 📌 Implement CDN for images

---

## 🔍 Quick Reference

**Total Tables:** 4  
**Total Storage Buckets:** 1  
**Total API Routes:** 6  
**Total Components:** 20+  
**Total Pages:** 4  

**Database Size:** Small to Medium  
**Expected Growth:** Linear with poll creation  
**Performance:** Optimized for read-heavy workloads
