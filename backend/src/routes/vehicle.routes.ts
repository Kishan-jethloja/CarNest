import { Router } from 'express';
import { createVehicle } from '../controllers/vehicle.controller';
import { authenticateCustomer } from '../middlewares/auth.middleware';
import { validateVehicle } from '../middlewares/validation.middleware';

const router = Router();

// POST /api/vehicles
router.post('/', authenticateCustomer, validateVehicle, createVehicle);

export default router;
