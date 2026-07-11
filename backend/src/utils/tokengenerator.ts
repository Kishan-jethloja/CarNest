import * as jwt from 'jsonwebtoken';

const getSecret = (): string => process.env.JWT_SECRET || 'fallback_secret';
const getExpiresIn = (): any => process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generates a JSON Web Token (JWT) for a user
 * @param payload The payload to sign (e.g. { id, role })
 * @returns The signed JWT string
 */
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: getExpiresIn() });
};

/**
 * Verifies a JSON Web Token (JWT)
 * @param token The token string to verify
 * @returns The decoded token payload, or throws an error if invalid
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, getSecret());
};
