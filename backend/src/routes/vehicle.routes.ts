import { Router } from 'express';
import { createVehicle, getVehicles } from '../controllers/vehicle.controller';
import { authenticateCustomer } from '../middlewares/auth.middleware';
import { validateVehicle } from '../middlewares/validation.middleware';

const router = Router();

// GET /api/vehicles
router.get('/', authenticateCustomer, getVehicles);

// POST /api/vehicles
router.post('/', authenticateCustomer, validateVehicle, createVehicle);

export default router;
