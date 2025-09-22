import { createClient } from 'redis';
import { logger } from './logger';

// Create Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 20) {
        logger.error('Too many Redis reconnection attempts, giving up');
        return new Error('Too many retries.');
      }
      return Math.min(retries * 50, 1000);
    },
  },
});

// Redis event handlers
redisClient.on('connect', () => {
  logger.info('✅ Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('🚀 Redis client ready');
});

redisClient.on('error', (err) => {
  logger.error('❌ Redis client error:', err);
});

redisClient.on('end', () => {
  logger.info('🔌 Redis client disconnected');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error);
  }
})();

// Redis utility functions
export const redisService = {
  // Set a key with expiration
  async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    try {
      if (expireInSeconds) {
        await redisClient.setEx(key, expireInSeconds, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  },

  // Get a key
  async get(key: string): Promise<string | null> {
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      throw error;
    }
  },

  // Delete a key
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      throw error;
    }
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      throw error;
    }
  },

  // Increment a key
  async incr(key: string): Promise<number> {
    try {
      return await redisClient.incr(key);
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      throw error;
    }
  },

  // Set expiration for a key
  async expire(key: string, seconds: number): Promise<void> {
    try {
      await redisClient.expire(key, seconds);
    } catch (error) {
      logger.error(`Redis EXPIRE error for key ${key}:`, error);
      throw error;
    }
  },

  // Add to set
  async sadd(key: string, ...members: string[]): Promise<void> {
    try {
      await redisClient.sAdd(key, members);
    } catch (error) {
      logger.error(`Redis SADD error for key ${key}:`, error);
      throw error;
    }
  },

  // Get set members
  async smembers(key: string): Promise<string[]> {
    try {
      return await redisClient.sMembers(key);
    } catch (error) {
      logger.error(`Redis SMEMBERS error for key ${key}:`, error);
      throw error;
    }
  },

  // Cache with JSON serialization
  async setObject(key: string, obj: any, expireInSeconds?: number): Promise<void> {
    try {
      const value = JSON.stringify(obj);
      await this.set(key, value, expireInSeconds);
    } catch (error) {
      logger.error(`Redis SET OBJECT error for key ${key}:`, error);
      throw error;
    }
  },

  // Get cached object
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Redis GET OBJECT error for key ${key}:`, error);
      throw error;
    }
  },
};