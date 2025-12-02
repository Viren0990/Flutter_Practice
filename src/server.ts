import app from './app';
import { initDatabase } from './db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize database first, then start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Gold Rate API endpoint: http://localhost:${PORT}/api/gold-rate`);
      console.log(`💻 Frontend: http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
