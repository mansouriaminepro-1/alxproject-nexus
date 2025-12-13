// 🔹 API Configuration
// Base URL for API calls
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// 🔹 Routes
// Client-side route definitions
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    SIGNUP: '/signup',
    CREATE_POLL: '/create-poll',
    POLL: (id: string) => `/poll/${id}`,
    RESULTS: (id: string) => `/poll/${id}/results`,
} as const;

// 🔹 API Endpoints
// Server-side API route definitions
export const API_ENDPOINTS = {
    DASHBOARD: '/api/dashboard',
    POLLS: '/api/polls',
    POLL: (id: string) => `/api/polls/${id}`,
    VOTE: (pollId: string) => `/api/polls/${pollId}/vote`,
    CREATE_POLL: '/api/polls/create',
    SIGNUP: '/api/auth/signup',
} as const;
