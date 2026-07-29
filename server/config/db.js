import mongoose from 'mongoose';
import dns from 'dns';

// Force DNS servers to Google & Cloudflare public DNS to fix Windows querySrv ECONNREFUSED issues
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('[DNS Config Warning]:', e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB Error]: ${err.message}`);
});

export default connectDB;
