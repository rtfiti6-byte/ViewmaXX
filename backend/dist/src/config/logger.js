"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerHelpers = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
const transports = [
    new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => {
            return `${info.timestamp} [${info.level}]: ${info.message}`;
        })),
    }),
];
if (process.env.NODE_ENV === 'production') {
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'error.log'),
        level: 'error',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    }));
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'combined.log'),
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    }));
}
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports,
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join('logs', 'exceptions.log') }),
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({ filename: path_1.default.join('logs', 'rejections.log') }),
    ],
});
if (process.env.NODE_ENV === 'production') {
    const fs = require('fs');
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
    }
}
exports.loggerHelpers = {
    logRequest: (req, res, responseTime) => {
        exports.logger.http('HTTP Request', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id,
        });
    },
    logAuth: (event, userId, details) => {
        exports.logger.info('Authentication Event', {
            event,
            userId,
            ...details,
        });
    },
    logVideo: (event, videoId, userId, details) => {
        exports.logger.info('Video Event', {
            event,
            videoId,
            userId,
            ...details,
        });
    },
    logError: (error, context) => {
        exports.logger.error('Application Error', {
            message: error.message,
            stack: error.stack,
            ...context,
        });
    },
    logSecurity: (event, severity, details) => {
        exports.logger.warn('Security Event', {
            event,
            severity,
            timestamp: new Date().toISOString(),
            ...details,
        });
    },
    logPerformance: (operation, duration, details) => {
        exports.logger.info('Performance Metric', {
            operation,
            duration: `${duration}ms`,
            ...details,
        });
    },
};
//# sourceMappingURL=logger.js.map