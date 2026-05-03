import app from './app.js';
import { config } from './config/index.js';
import mongoose from 'mongoose';

const startServer = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('✓ MongoDB connected');

    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();