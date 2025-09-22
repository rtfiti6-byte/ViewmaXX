"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSecurityEvent = exports.logAuthEvent = exports.logVideoEvent = exports.logEvent = exports.requestLogger = void 0;
const logger_1 = require("../config/logger");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    logger_1.logger.info('Incoming Request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        timestamp: new Date().toISOString(),
    });
    res.on('finish', () => {
        const responseTime = Date.now() - start;
        logger_1.loggerHelpers.logRequest(req, res, responseTime);
    });
    next();
};
exports.requestLogger = requestLogger;
const logEvent = (eventType) => {
    return (req, res, next) => {
        logger_1.logger.info(`Event: ${eventType}`, {
            userId: req.user?.id,
            params: req.params,
            body: req.body,
            timestamp: new Date().toISOString(),
        });
        next();
    };
};
exports.logEvent = logEvent;
const logVideoEvent = (eventType) => {
    return (req, res, next) => {
        const videoId = (req.params.videoId || req.params.id || '').toString();
        logger_1.loggerHelpers.logVideo(eventType, videoId, req.user?.id, {
            params: req.params,
            query: req.query,
            timestamp: new Date().toISOString(),
        });
        next();
    };
};
exports.logVideoEvent = logVideoEvent;
const logAuthEvent = (eventType) => {
    return (req, res, next) => {
        logger_1.loggerHelpers.logAuth(eventType, req.user?.id, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString(),
        });
        next();
    };
};
exports.logAuthEvent = logAuthEvent;
const logSecurityEvent = (eventType, severity) => {
    return (req, res, next) => {
        logger_1.loggerHelpers.logSecurity(eventType, severity, {
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
exports.logSecurityEvent = logSecurityEvent;
//# sourceMappingURL=requestLogger.js.map