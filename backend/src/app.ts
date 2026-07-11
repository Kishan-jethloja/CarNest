import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Routes will be added here
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
  });
});

export default app;
