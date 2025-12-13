// 🔹 Dashboard Response Types
// Structure for dashboard API responses
export interface DashboardResponse {
    owner: {
        name: string;
        restaurantName: string;
        email: string;
    };
    stats: {
        totalVotes: number;
        menuWins: number;
        activeReach: number;
    };
    activePolls: Poll[];
    historyPolls: Poll[];
}

// 🔹 Poll Entity Types
// Definition of a Poll object in API context
export interface Poll {
    id: string;
    title: string;
    status: 'Active' | 'Completed';
    endsIn: string;
    totalVotes: number;
    date: string;
    items: PollItem[];
    winRate: string;
    image?: string;
}

// Definition of an individual item within a poll
export interface PollItem {
    id: string;
    name: string;
    description?: string;
    image: string;
    price?: string;
    votes: number;
    percentage: number;
}

// 🔹 Vote API Types
// Payload for submitting a vote
export interface VoteRequest {
    itemId: string;
}

// Response from vote submission
export interface VoteResponse {
    success: boolean;
    error?: string;
}

// 🔹 Poll Creation Types
// Response after creating a new poll
export interface CreatePollResponse {
    success: boolean;
    pollId?: string;
    error?: string;
    details?: string[];
}
