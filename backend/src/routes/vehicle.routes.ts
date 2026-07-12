import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
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

// POST /api/vehicles
router.post('/', authenticateCustomer, validateVehicle, createVehicle);

// PUT /api/vehicles/:id
router.put('/:id', authenticateCustomer, validateVehicleUpdate, updateVehicle);

// DELETE /api/vehicles/:id
router.delete('/:id', authenticateAdmin, deleteVehicle);

// POST /api/vehicles/:id/purchase
router.post('/:id/purchase', authenticateCustomer, purchaseVehicle);

// POST /api/vehicles/:id/restock
router.post('/:id/restock', authenticateAdmin, restockVehicle);

export default router;
