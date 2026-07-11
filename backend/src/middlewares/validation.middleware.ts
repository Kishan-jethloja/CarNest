import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { VehicleModel } from '../models/vehicle.model';
import { formatZodError } from '../utils/validators';

export const validateVehicle = (req: Request, res: Response, next: NextFunction): void => {
  try {
    VehicleModel.build(req.body);
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: formatZodError(error),
      });
      return;
    }
    res.status(400).json({ success: false, message: 'Invalid vehicle data' });
  }
};

export const validateVehicleUpdate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    VehicleModel.buildPartial(req.body);
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: formatZodError(error),
      });
      return;
    }
    res.status(400).json({ success: false, message: 'Invalid vehicle update data' });
  }
};
