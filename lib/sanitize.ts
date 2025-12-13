/**
 * Input Sanitization Utilities
 * 
 * Provides functions to sanitize user input and prevent XSS attacks.
 * Defense in depth: Even though React escapes output, we sanitize input.
 */

/**
 * Remove HTML tags and dangerous characters from input.
 * Defense against XSS.
 * 
 * @param input - Raw user input
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string
 */
// 🔹 Core Sanitization
export function sanitizeInput(input: string, maxLength: number = 500): string {
    if (!input) return '';

    return input
        .trim()                           // Remove leading/trailing whitespace
        .replace(/[<>]/g, '')            // Remove < and > (prevents HTML tags)
        .replace(/['"]/g, '')            // Remove quotes (prevents attribute injection)
        .substring(0, maxLength);        // Enforce max length
}

/**
 * Sanitize poll title (max 100 characters).
 * 
 * @param title - Raw poll title
 * @returns Sanitized title
 */
// 🔹 Field-Specific Sanitizers
export function sanitizePollTitle(title: string): string {
    return sanitizeInput(title, 100);
}

/**
 * Sanitize poll description/question (max 500 characters)
 * @param description - Raw poll description
 * @returns Sanitized description
 */
export function sanitizePollDescription(description: string): string {
    return sanitizeInput(description, 500);
}

/**
 * Sanitize item name (max 100 characters)
 * @param name - Raw item name
 * @returns Sanitized name
 */
export function sanitizeItemName(name: string): string {
    return sanitizeInput(name, 100);
}

/**
 * Sanitize item description (max 500 characters)
 * @param description - Raw item description
 * @returns Sanitized description
 */
export function sanitizeItemDescription(description: string): string {
    return sanitizeInput(description, 500);
}
