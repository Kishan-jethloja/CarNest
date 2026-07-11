import { Router } from 'express';
import { createVehicle } from '../controllers/vehicle.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/vehicles
router.post('/', authenticateToken, createVehicle);

export default router;
