// src/lib/redisClient.ts
import { createClient } from 'redis';

// Create and configure the Redis client
const client = createClient({
  password: process.env.REDIS_PASSWORD, // Use environment variables for credentials
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// Connect to Redis
client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => console.error('Redis connection error:', err));

// Gracefully handle connection errors
client.on('error', (err) => {
  console.error('Redis error:', err);
});

export default client;
