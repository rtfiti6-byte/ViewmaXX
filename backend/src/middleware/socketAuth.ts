import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Socket interface to include userId
declare module 'socket.io' {
  interface Socket {
    userId?: string;
    user?: any;
  }
}

export const authSocket = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Socket connection attempted without token');
      return next(new Error('Authentication error'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user from database
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
      logger.warn(`Socket authentication failed: user not found - ${decoded.id}`);
      return next(new Error('User not found'));
    }

    if (user.isBanned || user.isSuspended) {
      logger.warn(`Socket authentication failed: user restricted - ${user.id}`);
      return next(new Error('Account restricted'));
    }

    // Attach user info to socket
    socket.userId = user.id;
    socket.user = user;

    logger.info(`Socket authenticated for user: ${user.username} (${user.id})`);
    next();
  } catch (error: any) {
    logger.error('Socket authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return next(new Error('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      return next(new Error('Token expired'));
    }
    
    return next(new Error('Authentication error'));
  }
};

// Optional socket authentication (doesn't fail if no token)
export const optionalAuthSocket = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      // No token provided, continue without authentication
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

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
      logger.info(`Socket optionally authenticated for user: ${user.username}`);
    }

    next();
  } catch (error) {
    // If authentication fails, continue without user info
    logger.debug('Optional socket authentication failed, continuing as guest');
    next();
  }
};