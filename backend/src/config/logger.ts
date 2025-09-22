import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define which transports the logger will use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.printf((info) => {
        return `${info.timestamp} [${info.level}]: ${info.message}`;
      })
    ),
  }),
];

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    })
  );
}

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'rejections.log') }),
  ],
});

// Ensure logs directory exists
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }
}

// Helper functions for structured logging
export const loggerHelpers = {
  // Log HTTP requests
  logRequest: (req: any, res: any, responseTime: number) => {
    logger.http('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
    });
  },

  // Log authentication events
  logAuth: (event: string, userId?: string, details?: any) => {
    logger.info('Authentication Event', {
      event,
      userId,
      ...details,
    });
  },

  // Log video events
  logVideo: (event: string, videoId: string, userId?: string, details?: any) => {
    logger.info('Video Event', {
      event,
      videoId,
      userId,
      ...details,
    });
  },

  // Log errors with context
  logError: (error: Error, context?: any) => {
    logger.error('Application Error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  },

  // Log security events
  logSecurity: (event: string, severity: 'low' | 'medium' | 'high', details?: any) => {
    logger.warn('Security Event', {
      event,
      severity,
      timestamp: new Date().toISOString(),
      ...details,
    });
  },

  // Log performance metrics
  logPerformance: (operation: string, duration: number, details?: any) => {
    logger.info('Performance Metric', {
      operation,
      duration: `${duration}ms`,
      ...details,
    });
  },
};