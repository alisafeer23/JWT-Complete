// src/app/token-utils.ts

/**
 * Decodes a JWT token and returns its payload.
 * @param token The JWT token to decode.
 * @returns The decoded payload, or null if the token is invalid.
 */
export function decodeToken(token: string): any {
    if (!token) {
      return null;
    }
  
    try {
      // Decode the token payload
      const base64Url = token.split('.')[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
      const jsonPayload = window.atob(base64); // Decode Base64
      return JSON.parse(jsonPayload); // Parse JSON
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
  