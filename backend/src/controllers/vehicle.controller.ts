import { Request, Response } from 'express';
import { pool } from '../config/db';
import { buildVehicleSearchQuery } from '../utils/queryBuilder';

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation is now safely handled upstream by validateVehicle middleware.
    // We can confidently extract the payload directly.
    const { name, make, model, category, price, quantity, description } = req.body;

    const insertQuery = `
      INSERT INTO vehicles (name, make, model, category, price, quantity, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [name, make, model, category, price, quantity, description || null];

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
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create vehicle',
    });
  }
};

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const fetchQuery = `SELECT * FROM vehicles ORDER BY created_at DESC`;
    const result = await pool.query(fetchQuery);

    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: {
        vehicles: result.rows,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve vehicles',
    });
  }
};

export const searchVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fetchQuery, queryParams } = buildVehicleSearchQuery(req.query);

    const result = await pool.query(fetchQuery, queryParams);

    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: {
        vehicles: result.rows,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search vehicles',
    });
  }
};
