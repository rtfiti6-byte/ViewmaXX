import { Request, Response, NextFunction } from 'express';
import { logger, loggerHelpers } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request details
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
  });

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    loggerHelpers.logRequest(req, res, responseTime);
  });

  next();
};

// Middleware to log specific events
export const logEvent = (eventType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Event: ${eventType}`, {
      userId: req.user?.id,
      params: req.params,
      body: req.body,
      timestamp: new Date().toISOString(),
    });
    next();
  };
};

// Middleware to log video-related events
export const logVideoEvent = (eventType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const videoId = (req.params.videoId || req.params.id || '').toString();
    loggerHelpers.logVideo(eventType, videoId, req.user?.id, {
      params: req.params,
      query: req.query,
      timestamp: new Date().toISOString(),
    });
    
    next();
  };
};

// Middleware to log authentication events
export const logAuthEvent = (eventType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    loggerHelpers.logAuth(eventType, req.user?.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    });
    
    next();
  };
};

// Middleware to log security events
export const logSecurityEvent = (eventType: string, severity: 'low' | 'medium' | 'high') => {
  return (req: Request, res: Response, next: NextFunction) => {
    loggerHelpers.logSecurity(eventType, severity, {
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
    
    next();
  };
};