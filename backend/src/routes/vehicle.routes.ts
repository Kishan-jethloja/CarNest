import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../controllers/vehicle.controller';
import { authenticateCustomer, authenticateAdmin } from '../middlewares/auth.middleware';
import { validateVehicle, validateVehicleUpdate } from '../middlewares/validation.middleware';

const router = Router();

// GET /api/vehicles
router.get('/', authenticateCustomer, getVehicles);

// GET /api/vehicles/search
router.get('/search', authenticateCustomer, searchVehicles);

// GET /api/vehicles/:id
router.get('/:id', authenticateCustomer, getVehicleById);

// POST /api/vehicles
router.post('/', authenticateAdmin, validateVehicle, createVehicle);

// PUT /api/vehicles/:id
router.put('/:id', authenticateAdmin, validateVehicleUpdate, updateVehicle);

// DELETE /api/vehicles/:id
router.delete('/:id', authenticateAdmin, deleteVehicle);

// POST /api/vehicles/:id/purchase
router.post('/:id/purchase', authenticateCustomer, purchaseVehicle);

// POST /api/vehicles/:id/restock
router.post('/:id/restock', authenticateAdmin, restockVehicle);

export default router;
