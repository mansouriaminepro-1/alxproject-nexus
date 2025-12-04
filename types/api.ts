// Dashboard API Response Types
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

export interface PollItem {
    id: string;
    name: string;
    description?: string;
    image: string;
    price?: string;
    votes: number;
    percentage: number;
}

// Vote API Types
export interface VoteRequest {
    itemId: string;
}

export interface VoteResponse {
    success: boolean;
    error?: string;
}

// Poll Creation Types
export interface CreatePollResponse {
    success: boolean;
    pollId?: string;
    error?: string;
    details?: string[];
}
