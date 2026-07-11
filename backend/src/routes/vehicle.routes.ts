import { Router } from 'express';
import { createVehicle, getVehicles, searchVehicles } from '../controllers/vehicle.controller';
import { authenticateCustomer } from '../middlewares/auth.middleware';
import { validateVehicle } from '../middlewares/validation.middleware';

const router = Router();

// GET /api/vehicles
router.get('/', authenticateCustomer, getVehicles);

// GET /api/vehicles/search
router.get('/search', authenticateCustomer, searchVehicles);

// POST /api/vehicles
router.post('/', authenticateCustomer, validateVehicle, createVehicle);

export default router;
