import dns from 'dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || process.env.URI;
  console.log('Mongo URI loaded');

  if (!mongoUri) {
    throw new Error('MongoDB URI is missing from the environment');
  }

  // Serverless-friendly options: disable command buffering so operations
  // fail immediately instead of queueing, and set tight timeouts so
  // Vercel functions don't hit the 10 s buffer-timeout wall.
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 8000,
    bufferCommands: false,
  });
  console.log('MongoDB connected');
}
