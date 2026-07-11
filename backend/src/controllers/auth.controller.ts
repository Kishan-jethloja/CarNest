import { Request, Response } from 'express';
import { z } from 'zod';
import { UserModel } from '../models/user.model';
import { pool } from '../config/db';
import { formatZodError } from '../utils/validators';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate incoming data
    const validData = UserModel.build(req.body);

    // 2. Hash password
    const hashedPassword = await UserModel.hashPassword(validData.password);

    // 3. Insert into database
    const insertQuery = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [validData.username, validData.email, hashedPassword];

    const result = await pool.query(insertQuery, values);
    const createdUser = result.rows[0];

    // 4. Return sanitized response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: UserModel.toJSON(createdUser),
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: formatZodError(error),
      });
      return;
    }

    // Handle PostgreSQL unique constraint violations (username or email already exists)
    if (error.code === '23505') {
      res.status(409).json({
        success: false,
        message: 'Username or email already exists',
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};
