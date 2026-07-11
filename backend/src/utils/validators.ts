import { z } from 'zod';

/**
 * Formats a Zod validation error into a clean, human-readable string.
 * It extracts the first error issue and properly handles missing field errors.
 *
 * @param error The ZodError object
 * @returns A formatted error message string
 */
export const formatZodError = (error: z.ZodError): string => {
  if (!error.issues || error.issues.length === 0) {
    return 'Validation failed';
  }

  const issue = error.issues[0];
  if (!issue) {
    return 'Validation failed';
  }

  // Handle Zod's default undefined error for missing required fields
  if (issue.code === 'invalid_type' && (issue as any).received === 'undefined') {
    // Capitalize the first letter of the field path
    const field = String(issue.path[0]);
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
  }

  return issue.message;
};
