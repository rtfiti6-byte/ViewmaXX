import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from './errorHandler';
import { redisService } from '../config/redis';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const signToken = (id: string, email: string, role: string): string => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as jwt.SignOptions
  );
};

const signRefreshToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

export const generateTokens = async (user: any) => {
  const accessToken = signToken(user.id, user.email, user.role);
  const refreshToken = signRefreshToken(user.id);

  // Store refresh token in Redis with expiration
  const refreshExpiry = 7 * 24 * 60 * 60; // 7 days in seconds
  await redisService.set(`refresh_token:${user.id}`, refreshToken, refreshExpiry);

  // Update user's refresh token in database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3) Check if user still exists
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
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) Check if user is banned or suspended
    if (currentUser.isBanned) {
      return next(new AppError('Your account has been banned.', 403));
    }

    if (currentUser.isSuspended) {
      return next(new AppError('Your account has been suspended.', 403));
    }

    // 5) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again!', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired! Please log in again.', 401));
    }
    return next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
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
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

export const refreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string };

    // Check if refresh token exists in Redis
    const storedToken = await redisService.get(`refresh_token:${decoded.id}`);
    if (!storedToken || storedToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.isBanned || user.isSuspended) {
      return next(new AppError('User not found or account restricted', 401));
    }

    // Generate new tokens
    const tokens = await generateTokens(user);

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
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired refresh token', 401));
    }
    return next(error);
  }
};

export const revokeToken = async (userId: string) => {
  try {
    // Remove refresh token from Redis
    await redisService.del(`refresh_token:${userId}`);
    
    // Remove refresh token from database
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    logger.info(`Tokens revoked for user: ${userId}`);
  } catch (error) {
    logger.error('Error revoking tokens:', error);
  }
};
