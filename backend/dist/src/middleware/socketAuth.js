"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthSocket = exports.authSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const logger_1 = require("../config/logger");
const prisma = new client_1.PrismaClient();
const authSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            logger_1.logger.warn('Socket connection attempted without token');
            return next(new Error('Authentication error'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatar: true,
                role: true,
                isVerified: true,
                isBanned: true,
                isSuspended: true,
            },
        });
        if (!user) {
            logger_1.logger.warn(`Socket authentication failed: user not found - ${decoded.id}`);
            return next(new Error('User not found'));
        }
        if (user.isBanned || user.isSuspended) {
            logger_1.logger.warn(`Socket authentication failed: user restricted - ${user.id}`);
            return next(new Error('Account restricted'));
        }
        socket.userId = user.id;
        socket.user = user;
        logger_1.logger.info(`Socket authenticated for user: ${user.username} (${user.id})`);
        next();
    }
    catch (error) {
        logger_1.logger.error('Socket authentication error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return next(new Error('Invalid token'));
        }
        else if (error.name === 'TokenExpiredError') {
            return next(new Error('Token expired'));
        }
        return next(new Error('Authentication error'));
    }
};
exports.authSocket = authSocket;
const optionalAuthSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatar: true,
                role: true,
                isVerified: true,
                isBanned: true,
                isSuspended: true,
            },
        });
        if (user && !user.isBanned && !user.isSuspended) {
            socket.userId = user.id;
            socket.user = user;
            logger_1.logger.info(`Socket optionally authenticated for user: ${user.username}`);
        }
        next();
    }
    catch (error) {
        logger_1.logger.debug('Optional socket authentication failed, continuing as guest');
        next();
    }
};
exports.optionalAuthSocket = optionalAuthSocket;
//# sourceMappingURL=socketAuth.js.map