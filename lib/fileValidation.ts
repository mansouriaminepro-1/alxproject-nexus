/**
 * File Upload Validation Utility
 * 
 * Validates file uploads for security and quality
 */

// 🔹 Configuration
// Allowed image MIME types for upload validation
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
] as const;

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// 🔹 Types
export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate an uploaded image file.
 * Checks for existence, size, MIME type, and extension matching.
 * 
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
// 🔹 Validation Functions
export function validateImageFile(file: File | null): FileValidationResult {
    // Check if file exists
    if (!file || file.size === 0) {
        return {
            valid: false,
            error: 'Image file is required'
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return {
            valid: false,
            error: `Image file size (${sizeMB}MB) exceeds the maximum allowed size of 5MB`
        };
    }

    // Check MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
        return {
            valid: false,
            error: `Invalid file type "${file.type}". Only JPEG, PNG, WebP, and GIF images are allowed`
        };
    }

    // Check file extension matches MIME type (basic check)
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const expectedExts: Record<string, string[]> = {
        'image/jpeg': ['jpg', 'jpeg'],
        'image/jpg': ['jpg', 'jpeg'],
        'image/png': ['png'],
        'image/webp': ['webp'],
        'image/gif': ['gif']
    };

    const allowedExts = expectedExts[file.type] || [];
    if (fileExt && !allowedExts.includes(fileExt)) {
        return {
            valid: false,
            error: `File extension ".${fileExt}" does not match the file type "${file.type}"`
        };
    }

    return { valid: true };
}

/**
 * Sanitize filename to prevent path traversal and special characters.
 * Replaces non-alphanumeric characters with underscores.
 * 
 * @param filename - Original filename
 * @returns Sanitized filename
 */
// 🔹 Helper Functions
export function sanitizeFilename(filename: string): string {
    // Remove path separators and special characters
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.+/g, '.')
        .replace(/_+/g, '_')
        .substring(0, 100); // Limit length
}

/**
 * Get file extension from filename
 * @param filename - Filename to extract extension from
 * @returns File extension (lowercase) or 'jpg' as fallback
 */
export function getFileExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext || 'jpg';
}

/**
 * Validate multiple image files
 * @param files - Array of files to validate
 * @returns Validation result for all files
 */
export function validateImageFiles(files: (File | null)[]): FileValidationResult {
    for (let i = 0; i < files.length; i++) {
        const result = validateImageFile(files[i]);
        if (!result.valid) {
            return {
                valid: false,
                error: `Item ${String.fromCharCode(65 + i)}: ${result.error}`
            };
        }
    }
    return { valid: true };
}
