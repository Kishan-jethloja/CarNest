import express from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// System Diagnostics Route
app.get('/health', (req, res) => {
  res.status(200).json({
    systemState: 'OK',
    details: 'API is operational',
    timestamp: new Date().toISOString(),
  });
});

export default app;
