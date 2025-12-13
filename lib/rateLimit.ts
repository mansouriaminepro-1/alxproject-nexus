/**
 * Rate Limiter Utility
 * 
 * Simple in-memory rate limiter using sliding window algorithm.
 * Suitable for Vercel serverless functions.
 * 
 * Note: Limits are per-instance. For distributed rate limiting across
 * multiple regions, consider Upstash Redis or Vercel KV.
 */

// 🔹 Types
interface RateLimitConfig {
    requests: number;  // Max requests allowed
    window: number;    // Time window in seconds
}

interface RequestLog {
    count: number;
    resetTime: number;
}

// 🔹 Storage
// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RequestLog>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Check if a request should be rate limited.
 * Uses a sliding window algorithm.
 * 
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Object with success status and rate limit info
 */
// 🔹 Core Logic
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
} {
    const now = Date.now();
    const key = `${identifier}`;

    // Get or create request log
    let log = rateLimitStore.get(key);

    if (!log || now > log.resetTime) {
        // Create new window
        log = {
            count: 0,
            resetTime: now + config.window * 1000,
        };
        rateLimitStore.set(key, log);
    }

    // Check if limit exceeded
    if (log.count >= config.requests) {
        return {
            success: false,
            limit: config.requests,
            remaining: 0,
            reset: Math.ceil(log.resetTime / 1000),
        };
    }

    // Increment count
    log.count++;

    return {
        success: true,
        limit: config.requests,
        remaining: config.requests - log.count,
        reset: Math.ceil(log.resetTime / 1000),
    };
}

/**
 * Get client IP address from request.
 * Compatible with Vercel's proxy headers.
 */
// 🔹 Helpers
export function getClientIp(request: Request): string {
    // Try Vercel's forwarded IP first
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    // Try real IP header
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback to a default (shouldn't happen on Vercel)
    return 'unknown';
}

/**
 * Predefined rate limit configurations for different app actions.
 */
// 🔹 Configuration
export const RATE_LIMITS = {
    pollCreate: { requests: 150, window: 3600 },    // 150 requests per hour
    vote: { requests: 500, window: 3600 },          // 500 requests per hour
    dashboard: { requests: 1000, window: 3600 },    // 1000 requests per hour
    signup: { requests: 10, window: 3600 },         // 10 requests per hour
    pollView: { requests: 2000, window: 3600 },     // 2000 requests per hour
    default: { requests: 300, window: 3600 },       // 300 requests per hour
} as const;
