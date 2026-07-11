import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// System Diagnostics Route
app.get('/health', (req, res) => {
  res.status(200).json({
    systemState: 'OK',
    details: 'API is operational',
    timestamp: new Date().toISOString(),
  });
});

export default app;
