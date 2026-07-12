import { Request, Response } from 'express';
import { pool } from '../config/db';
import { validateStock } from '../utils/validators';
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

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, message: 'No fields provided for update' });
      return;
    }

    // First check if the vehicle exists
    const checkResult = await pool.query(`SELECT id FROM vehicles WHERE id = $1`, [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    let setClauses: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${paramIndex}`);
      queryParams.push(value);
      paramIndex++;
    }

    queryParams.push(id);
    const updateQuery = `
      UPDATE vehicles 
      SET ${setClauses.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, queryParams);

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: {
        vehicle: result.rows[0],
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update vehicle',
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleteQuery = `DELETE FROM vehicles WHERE id = $1 RETURNING *;`;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete vehicle',
    });
  }
};

export const purchaseVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const purchaseQuantity = req.body.quantity ? parseInt(req.body.quantity, 10) : 1;

    if (isNaN(purchaseQuantity) || purchaseQuantity <= 0) {
      res.status(400).json({ success: false, message: 'Invalid purchase quantity' });
      return;
    }

    const checkResult = await pool.query(`SELECT quantity FROM vehicles WHERE id = $1`, [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    const currentQuantity = checkResult.rows[0].quantity;

    const stockError = validateStock(currentQuantity, purchaseQuantity);
    if (stockError) {
      res.status(400).json({ success: false, message: stockError });
      return;
    }

    const updateQuery = `
      UPDATE vehicles 
      SET quantity = quantity - $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [purchaseQuantity, id]);

    res.status(200).json({
      success: true,
      message: 'Vehicle purchased successfully',
      data: {
        vehicle: result.rows[0],
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to purchase vehicle',
    });
  }
};

export const restockVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const restockQuantity = req.body.quantity ? parseInt(req.body.quantity, 10) : 1;

    if (isNaN(restockQuantity) || restockQuantity <= 0) {
      res.status(400).json({ success: false, message: 'Invalid restock quantity' });
      return;
    }

    const checkResult = await pool.query(`SELECT quantity FROM vehicles WHERE id = $1`, [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    const updateQuery = `
      UPDATE vehicles 
      SET quantity = quantity + $1 
      WHERE id = $2 
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [restockQuantity, id]);

    res.status(200).json({
      success: true,
      message: 'Vehicle restocked successfully',
      data: {
        vehicle: result.rows[0],
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to restock vehicle',
    });
  }
};
