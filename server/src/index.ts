import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import { connectDatabase } from './config/db';
import { initSocketServer } from './utils/socket';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

connectDatabase()
  .catch((err) => {
    console.error('Database connection failed', err);
    console.warn('Continuing startup without a MongoDB connection. Some features may be limited.');
  })
  .finally(() => {
    initSocketServer(server);
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
