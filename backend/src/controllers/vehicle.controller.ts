import { Request, Response } from 'express';
import { z } from 'zod';
import { VehicleModel } from '../models/vehicle.model';
import { pool } from '../config/db';
import { formatZodError } from '../utils/validators';

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validData = VehicleModel.build(req.body);

    const insertQuery = `
      INSERT INTO vehicles (name, make, model, category, price, quantity, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      validData.name,
      validData.make,
      validData.model,
      validData.category,
      validData.price,
      validData.quantity,
      validData.description || null,
    ];

    const result = await pool.query(insertQuery, values);
    const createdVehicle = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: {
        vehicle: createdVehicle,
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

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create vehicle',
    });
  }
};
