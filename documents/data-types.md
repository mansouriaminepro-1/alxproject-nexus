# Data Types & TypeScript Interfaces

This document defines all TypeScript interfaces and types used in the MenuFight platform that correspond to database entities.

## Database Entity Types

### Owner Type

Represents a restaurant owner profile from the `owners` table.

```typescript
export interface Owner {
  id: string;                    // UUID from auth.users
  restaurant_name: string;       // Restaurant name
  owner_name?: string;           // Owner display name
  restaurant_logo_url?: string;  // Logo image URL
  website?: string;              // Restaurant website
  created_at: string;            // ISO timestamp
}
```

**Usage:**
- Dashboard owner information
- Poll owner details on voting pages
- Profile settings

---

### Poll Type

Represents a poll/battle from the `poll` table.

```typescript
export interface Poll {
  id: string;                    // UUID
  owner_id: string;              // Foreign key to owners
  title: string;                 // Poll title (sanitized)
  description?: string;          // Poll question (sanitized)
  duration: '24h' | '48h' | '1 Week';  // Duration option
  closes_at: string;             // ISO timestamp
  created_at: string;            // ISO timestamp
  is_active: boolean;            // Active status
}
```

**Database Constraints:**
- `duration` must be one of: `'24h'`, `'48h'`, `'1 Week'`
- `closes_at` is calculated from `created_at + duration`

---

### PollItem Type

Represents a food item from the `poll_items` table.

```typescript
export interface PollItem {
  id: string;                    // UUID
  poll_id: string;               // Foreign key to poll
  item_name: string;             // Item name (sanitized)
  item_description?: string;     // Item description (sanitized)
  price?: number;                // Item price (decimal)
  image_url: string;             // Image URL from storage or placeholder
  position?: number;             // Display order (1 or 2)
}
```

**Notes:**
- `position` determines A/B ordering (1 = Item A, 2 = Item B)
- `image_url` defaults to placeholder if upload fails

---

### Vote Type

Represents a vote from the `votes` table.

```typescript
export interface Vote {
  id: string;                    // UUID
  poll_id: string;               // Foreign key to poll
  poll_item_id: string;          // Foreign key to poll_items
  ip_address: string;            // Voter IP address
  created_at?: string;           // ISO timestamp
}
```

**Unique Constraint:**
- Combination of `(poll_id, ip_address)` must be unique
- Prevents duplicate votes from same IP per poll

---

## Frontend Display Types

These types are used for rendering data in the UI and may include computed fields.

### PollData (Vote Page)

Used on the voting page to display poll details with vote counts.

```typescript
export interface PollData {
  id: string;
  title: string;
  question: string;              // From poll.description
  endsIn: string;                // Computed: "24h 30m" or "Ended"
  totalVotes: number;            // Computed: sum of all votes
  createdAt: number;             // Unix timestamp
  restaurant: {
    name: string;                // From owner.restaurant_name
    location: string;            // Static: "Local Area"
    description: string;         // Static description
    avatar: string;              // From owner.restaurant_logo_url
    website: string;             // From owner.website
  };
  items: PollItemWithVotes[];    // Poll items with vote data
}

export interface PollItemWithVotes {
  id: string;
  name: string;                  // From poll_items.item_name
  description: string;           // From poll_items.item_description
  image: string;                 // From poll_items.image_url
  price: string;                 // Formatted: "$12.99"
  votes: number;                 // Computed vote count
}
```

**Computation Logic:**
```typescript
// Time remaining calculation
const endsAt = new Date(poll.closes_at);
const now = new Date();
const diff = endsAt.getTime() - now.getTime();
const hours = Math.floor(diff / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const endsIn = diff > 0 ? `${hours}h ${minutes}m` : 'Ended';
```

---

### DashboardData

Used on the owner dashboard to display polls and statistics.

```typescript
export interface DashboardData {
  owner: {
    name: string;                // Owner display name
    restaurantName: string;      // Restaurant name
    email: string;               // Owner email
  };
  stats: {
    totalVotes: number;          // Total votes across all polls
    menuWins: number;            // Number of completed polls
    activeReach: number;         // Unique voters (unique IPs)
  };
  activePolls: DashboardPoll[];  // Currently active polls
  historyPolls: DashboardPoll[]; // Completed polls
}

export interface DashboardPoll {
  id: string;
  title: string;
  status: 'Active' | 'Completed';
  endsIn: string;                // "2d left" or "Completed"
  totalVotes: number;            // Total votes for this poll
  date: string;                  // Formatted date: "12/4/2025"
  items: DashboardPollItem[];    // Items with vote percentages
  winRate: string;               // "Leading" or "Winner"
}

export interface DashboardPollItem {
  id: string;
  name: string;
  image: string;
  votes: number;                 // Vote count for this item
  percentage: number;            // Computed: (votes / totalVotes) * 100
}
```

**Computation Logic:**
```typescript
// Active vs Completed
const closesAt = new Date(poll.closes_at);
const isActive = poll.is_active && closesAt > new Date();

// Vote percentage
const percentage = totalVotes > 0 
  ? Math.round((itemVotes / totalVotes) * 100) 
  : 0;

// Unique voters
const uniqueIps = new Set(allVotes.map(v => v.ip_address));
const activeReach = uniqueIps.size;
```

---

## API Request/Response Types

### Create Poll Request

Form data structure for creating a new poll.

```typescript
export interface CreatePollFormData {
  title: string;                 // Max 100 chars (sanitized)
  question: string;              // Max 500 chars (sanitized)
  duration: '24h' | '48h' | '1 Week';
  
  // Item A
  itemA_name: string;            // Max 100 chars (sanitized)
  itemA_desc?: string;           // Max 300 chars (sanitized)
  itemA_price?: string;          // Numeric string
  itemA_image?: File;            // Image file
  
  // Item B
  itemB_name: string;            // Max 100 chars (sanitized)
  itemB_desc?: string;           // Max 300 chars (sanitized)
  itemB_price?: string;          // Numeric string
  itemB_image?: File;            // Image file
}
```

**Validation Rules:**
- All text fields are sanitized to prevent XSS
- Images validated for type and size
- Duration must be one of the allowed values

---

### Create Poll Response

```typescript
export interface CreatePollResponse {
  success: boolean;
  pollId?: string;               // UUID of created poll
  error?: string;                // Error message if failed
}
```

---

### Vote Request

```typescript
export interface VoteRequest {
  itemId: string;                // UUID of poll_item to vote for
}
```

---

### Vote Response

```typescript
export interface VoteResponse {
  success?: boolean;
  error?: string;                // Error message (e.g., "already voted")
}
```

**Error Cases:**
- `"You have already voted in this poll."` - Duplicate vote (error code 23505)
- `"Item ID is required"` - Missing itemId
- `"Failed to cast vote"` - Database error

---

## Sanitization Types

Input sanitization limits to prevent XSS attacks.

```typescript
export interface SanitizationLimits {
  pollTitle: {
    maxLength: 100;
    stripHtml: true;
  };
  pollDescription: {
    maxLength: 500;
    stripHtml: true;
  };
  itemName: {
    maxLength: 100;
    stripHtml: true;
  };
  itemDescription: {
    maxLength: 300;
    stripHtml: true;
  };
}
```

**Implementation:** `lib/sanitize.ts`

---

## Storage Types

### Image Upload

```typescript
export interface ImageUpload {
  file: File;
  pollId: string;
  itemKey: 'A' | 'B';
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;                  // Public URL if successful
  error?: string;                // Error message if failed
}
```

**File Path Pattern:**
```
{pollId}/{timestamp}-{itemKey}.{extension}
```

**Example:**
```
550e8400-e29b-41d4-a716-446655440000/1701234567890-A.jpg
```

---

## Utility Types

### Time Calculation

```typescript
export interface TimeRemaining {
  hours: number;
  minutes: number;
  isExpired: boolean;
  formatted: string;             // "24h 30m" or "Ended"
}

export function calculateTimeRemaining(closesAt: string): TimeRemaining {
  const endsAt = new Date(closesAt);
  const now = new Date();
  const diff = endsAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return {
      hours: 0,
      minutes: 0,
      isExpired: true,
      formatted: 'Ended'
    };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    hours,
    minutes,
    isExpired: false,
    formatted: `${hours}h ${minutes}m`
  };
}
```

---

### Vote Statistics

```typescript
export interface VoteStatistics {
  totalVotes: number;
  itemVotes: Record<string, number>;      // itemId -> vote count
  itemPercentages: Record<string, number>; // itemId -> percentage
  uniqueVoters: number;                   // Unique IP count
}

export function calculateVoteStats(votes: Vote[]): VoteStatistics {
  const totalVotes = votes.length;
  const itemVotes: Record<string, number> = {};
  const uniqueIps = new Set<string>();
  
  votes.forEach(vote => {
    itemVotes[vote.poll_item_id] = (itemVotes[vote.poll_item_id] || 0) + 1;
    if (vote.ip_address) {
      uniqueIps.add(vote.ip_address);
    }
  });
  
  const itemPercentages: Record<string, number> = {};
  Object.entries(itemVotes).forEach(([itemId, count]) => {
    itemPercentages[itemId] = totalVotes > 0 
      ? Math.round((count / totalVotes) * 100) 
      : 0;
  });
  
  return {
    totalVotes,
    itemVotes,
    itemPercentages,
    uniqueVoters: uniqueIps.size
  };
}
```

---

## Type Guards

```typescript
export function isPollActive(poll: Poll): boolean {
  const closesAt = new Date(poll.closes_at);
  return poll.is_active && closesAt > new Date();
}

export function isValidDuration(duration: string): duration is '24h' | '48h' | '1 Week' {
  return ['24h', '48h', '1 Week'].includes(duration);
}

export function hasVoted(error: any): boolean {
  return error?.code === '23505';
}
```

---

## Existing Type Files

The project currently has these type files:

### `types/index.ts`
```typescript
export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}
```

### `types/poll.ts`
```typescript
export interface PollItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  votes: number;
}

export interface PollData {
  id: string;
  title: string;
  question: string;
  endsIn: string;
  totalVotes: number;
  restaurant: {
    name: string;
    location: string;
    description: string;
    avatar: string;
    website: string;
  };
  items: PollItem[];
  createdAt: number;
}
```

---

## Type Usage Examples

### Creating a Poll

```typescript
import { CreatePollFormData, CreatePollResponse } from '@/types/api';

const formData = new FormData();
formData.append('title', 'Best Burger');
formData.append('question', 'Which burger should we add?');
formData.append('duration', '24h');
formData.append('itemA_name', 'Classic Burger');
formData.append('itemA_price', '12.99');
formData.append('itemA_image', imageFile);

const response = await fetch('/api/polls/create', {
  method: 'POST',
  body: formData
});

const result: CreatePollResponse = await response.json();
```

### Fetching Poll Data

```typescript
import { PollData } from '@/types/poll';

const response = await fetch(`/api/polls/${pollId}`);
const pollData: PollData = await response.json();

console.log(`Total votes: ${pollData.totalVotes}`);
console.log(`Ends in: ${pollData.endsIn}`);
```

### Casting a Vote

```typescript
import { VoteRequest, VoteResponse } from '@/types/api';

const voteRequest: VoteRequest = {
  itemId: selectedItemId
};

const response = await fetch(`/api/polls/${pollId}/vote`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(voteRequest)
});

const result: VoteResponse = await response.json();

if (result.error) {
  console.error(result.error);
}
```
