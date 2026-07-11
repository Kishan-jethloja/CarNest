import { z } from 'zod';
import bcrypt from 'bcrypt';

// Define the validation schema using Zod
const UserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  // Using explicit regex for email as requested
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters'),
  role: z.enum(['customer', 'admin']).default('customer'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type UserType = z.infer<typeof UserSchema>;

export class UserModel {
  /**
   * Database indexes for the users table (Raw SQL)
   */
  static readonly INDEXES = [
    'CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);',
    'CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON users(username);',
  ];

  /**
   * Validates and builds a user object with defaults
   */
  static build(data: any): UserType {
    // Zod's .parse() will throw an error if validation fails
    return UserSchema.parse(data);
  }

  /**
   * Transforms the user object for API responses by removing sensitive data
   */
  static toJSON(user: UserType): Omit<UserType, 'password'> {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Hashes a plain text password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares a plain text password with a hashed password
   */
  static async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
