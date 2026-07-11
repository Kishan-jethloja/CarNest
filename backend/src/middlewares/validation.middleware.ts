import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { VehicleModel } from '../models/vehicle.model';
import { formatZodError } from '../utils/validators';

/**
 * Higher-order utility function to generate Zod validation middlewares.
 * Dramatically reduces boilerplate and repetitive try/catch logic.
 */
const createValidator = (schemaBuilder: (data: any) => any, defaultMessage: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schemaBuilder(req.body);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: formatZodError(error),
        });
        return;
      }
      res.status(400).json({ success: false, message: defaultMessage });
    }
  };
};

export const validateVehicle = createValidator(VehicleModel.build, 'Invalid vehicle data');
export const validateVehicleUpdate = createValidator(
  VehicleModel.buildPartial,
  'Invalid vehicle update data',
);
