"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.catchAsync = exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    const error = new Error(message);
    error.statusCode = 400;
    error.isOperational = true;
    return error;
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    const error = new Error(message);
    error.statusCode = 400;
    error.isOperational = true;
    return error;
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors || {}).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    const error = new Error(message);
    error.statusCode = 400;
    error.isOperational = true;
    return error;
};
const handleJWTError = () => {
    const error = new Error('Invalid token. Please log in again!');
    error.statusCode = 401;
    error.isOperational = true;
    return error;
};
const handleJWTExpiredError = () => {
    const error = new Error('Your token has expired! Please log in again.');
    error.statusCode = 401;
    error.isOperational = true;
    return error;
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
    else {
        logger_1.logger.error('ERROR 💥', err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
};
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    else {
        let error = { ...err };
        error.message = err.message;
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
exports.errorHandler = errorHandler;
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=errorHandler.js.map