import app from './app';

const PORT = process.env.PORT || 5000;

// Conditional server startup (excludes test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}
