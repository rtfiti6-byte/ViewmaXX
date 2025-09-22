"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.redisClient = void 0;
const redis_1 = require("redis");
const logger_1 = require("./logger");
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 20) {
                logger_1.logger.error('Too many Redis reconnection attempts, giving up');
                return new Error('Too many retries.');
            }
            return Math.min(retries * 50, 1000);
        },
    },
});
exports.redisClient.on('connect', () => {
    logger_1.logger.info('✅ Redis client connected');
});
exports.redisClient.on('ready', () => {
    logger_1.logger.info('🚀 Redis client ready');
});
exports.redisClient.on('error', (err) => {
    logger_1.logger.error('❌ Redis client error:', err);
});
exports.redisClient.on('end', () => {
    logger_1.logger.info('🔌 Redis client disconnected');
});
(async () => {
    try {
        await exports.redisClient.connect();
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to connect to Redis:', error);
    }
})();
exports.redisService = {
    async set(key, value, expireInSeconds) {
        try {
            if (expireInSeconds) {
                await exports.redisClient.setEx(key, expireInSeconds, value);
            }
            else {
                await exports.redisClient.set(key, value);
            }
        }
        catch (error) {
            logger_1.logger.error(`Redis SET error for key ${key}:`, error);
            throw error;
        }
    },
    async get(key) {
        try {
            return await exports.redisClient.get(key);
        }
        catch (error) {
            logger_1.logger.error(`Redis GET error for key ${key}:`, error);
            throw error;
        }
    },
    async del(key) {
        try {
            await exports.redisClient.del(key);
        }
        catch (error) {
            logger_1.logger.error(`Redis DEL error for key ${key}:`, error);
            throw error;
        }
    },
    async exists(key) {
        try {
            const result = await exports.redisClient.exists(key);
            return result === 1;
        }
        catch (error) {
            logger_1.logger.error(`Redis EXISTS error for key ${key}:`, error);
            throw error;
        }
    },
    async incr(key) {
        try {
            return await exports.redisClient.incr(key);
        }
        catch (error) {
            logger_1.logger.error(`Redis INCR error for key ${key}:`, error);
            throw error;
        }
    },
    async expire(key, seconds) {
        try {
            await exports.redisClient.expire(key, seconds);
        }
        catch (error) {
            logger_1.logger.error(`Redis EXPIRE error for key ${key}:`, error);
            throw error;
        }
    },
    async sadd(key, ...members) {
        try {
            await exports.redisClient.sAdd(key, members);
        }
        catch (error) {
            logger_1.logger.error(`Redis SADD error for key ${key}:`, error);
            throw error;
        }
    },
    async smembers(key) {
        try {
            return await exports.redisClient.sMembers(key);
        }
        catch (error) {
            logger_1.logger.error(`Redis SMEMBERS error for key ${key}:`, error);
            throw error;
        }
    },
    async setObject(key, obj, expireInSeconds) {
        try {
            const value = JSON.stringify(obj);
            await this.set(key, value, expireInSeconds);
        }
        catch (error) {
            logger_1.logger.error(`Redis SET OBJECT error for key ${key}:`, error);
            throw error;
        }
    },
    async getObject(key) {
        try {
            const value = await this.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            logger_1.logger.error(`Redis GET OBJECT error for key ${key}:`, error);
            throw error;
        }
    },
};
//# sourceMappingURL=redis.js.map