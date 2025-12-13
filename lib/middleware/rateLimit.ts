import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../rateLimit';

// 🔹 Types
type RateLimitKey = keyof typeof RATE_LIMITS;

/**
 * Apply rate limiting to an API route
 * Returns a NextResponse with 429 status if limit exceeded
 * Returns null if request is allowed
 */
/**
 * Apply rate limiting to an API route.
 * Returns a NextResponse with 429 status if limit exceeded, or null if allowed.
 * 
 * @param request - The incoming request
 * @param limitKey - The rate limit configuration key
 */
// 🔹 Middleware Logic
export function applyRateLimit(
    request: Request,
    limitKey: RateLimitKey = 'default'
): NextResponse | null {
    const ip = getClientIp(request);
    const config = RATE_LIMITS[limitKey];

    const result = checkRateLimit(ip, config);

    // Add rate limit headers
    const headers = {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
    };

    if (!result.success) {
        return NextResponse.json(
            {
                error: 'Too many requests',
                message: `Rate limit exceeded. Try again after ${new Date(result.reset * 1000).toISOString()}`,
            },
            {
                status: 429,
                headers,
            }
        );
    }

    // Request is allowed, but we still want to add headers to the eventual response
    // The calling route should add these headers to their response
    return null;
}

/**
 * Get rate limit headers to add to successful responses
 */
/**
 * Get rate limit headers to add to successful responses.
 * 
 * @param request - The incoming request
 * @param limitKey - The rate limit configuration key
 */
// 🔹 Helpers
export function getRateLimitHeaders(
    request: Request,
    limitKey: RateLimitKey = 'default'
): Record<string, string> {
    const ip = getClientIp(request);
    const config = RATE_LIMITS[limitKey];
    const result = checkRateLimit(ip, config);

    return {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': Math.max(0, result.remaining - 1).toString(),
        'X-RateLimit-Reset': result.reset.toString(),
    };
}
