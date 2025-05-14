const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectWithRetry = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      wtimeoutMS: 25000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);
    
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying connection in ${RETRY_INTERVAL/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      return connectWithRetry(retryCount + 1);
    }
    
    throw error;
  }
};

const connectDB = async () => {
  try {
    await connectWithRetry();

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      // Attempt to reconnect on error
      setTimeout(() => connectDB(), RETRY_INTERVAL);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(() => connectDB(), RETRY_INTERVAL);
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      // Attempt to reconnect
      setTimeout(() => connectDB(), RETRY_INTERVAL);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB after all retries:', error);
    throw error;
  }
};

module.exports = connectDB; 
