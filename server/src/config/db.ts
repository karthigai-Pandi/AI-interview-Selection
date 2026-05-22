import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-interview-selection';

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not defined. Falling back to mongodb://127.0.0.1:27017/ai-interview-selection');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log('MongoDB connected');
};
