"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeToken = exports.refreshTokens = exports.optionalAuth = exports.authorize = exports.authenticate = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("./errorHandler");
const redis_1 = require("../config/redis");
const logger_1 = require("../config/logger");
const prisma = new client_1.PrismaClient();
const signToken = (id, email, role) => {
    return jsonwebtoken_1.default.sign({ id, email, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
};
const signRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};
const generateTokens = async (user) => {
    const accessToken = signToken(user.id, user.email, user.role);
    const refreshToken = signRefreshToken(user.id);
    const refreshExpiry = 7 * 24 * 60 * 60;
    await redis_1.redisService.set(`refresh_token:${user.id}`, refreshToken, refreshExpiry);
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new errorHandler_1.AppError('You are not logged in! Please log in to get access.', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatar: true,
                bio: true,
                role: true,
                isVerified: true,
                isBanned: true,
                isSuspended: true,
                subscribersCount: true,
                subscribingCount: true,
                totalViews: true,
                totalVideos: true,
                isMonetizationEnabled: true,
                createdAt: true,
                lastLogin: true,
            },
        });
        if (!currentUser) {
            return next(new errorHandler_1.AppError('The user belonging to this token does no longer exist.', 401));
        }
        if (currentUser.isBanned) {
            return next(new errorHandler_1.AppError('Your account has been banned.', 403));
        }
        if (currentUser.isSuspended) {
            return next(new errorHandler_1.AppError('Your account has been suspended.', 403));
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new errorHandler_1.AppError('Invalid token. Please log in again!', 401));
        }
        else if (error.name === 'TokenExpiredError') {
            return next(new errorHandler_1.AppError('Your token has expired! Please log in again.', 401));
        }
        return next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const currentUser = await prisma.user.findUnique({
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
            if (currentUser && !currentUser.isBanned && !currentUser.isSuspended) {
                req.user = currentUser;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const refreshTokens = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return next(new errorHandler_1.AppError('Refresh token is required', 400));
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await redis_1.redisService.get(`refresh_token:${decoded.id}`);
        if (!storedToken || storedToken !== refreshToken) {
            return next(new errorHandler_1.AppError('Invalid refresh token', 401));
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user || user.isBanned || user.isSuspended) {
            return next(new errorHandler_1.AppError('User not found or account restricted', 401));
        }
        const tokens = await (0, exports.generateTokens)(user);
        res.json({
            success: true,
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName,
                    avatar: user.avatar,
                    role: user.role,
                    isVerified: user.isVerified,
                },
            },
        });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new errorHandler_1.AppError('Invalid or expired refresh token', 401));
        }
        return next(error);
    }
};
exports.refreshTokens = refreshTokens;
const revokeToken = async (userId) => {
    try {
        await redis_1.redisService.del(`refresh_token:${userId}`);
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        logger_1.logger.info(`Tokens revoked for user: ${userId}`);
    }
    catch (error) {
        logger_1.logger.error('Error revoking tokens:', error);
    }
};
exports.revokeToken = revokeToken;
//# sourceMappingURL=auth.js.map