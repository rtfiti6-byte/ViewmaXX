"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReport = exports.validateSearch = exports.validatePlaylist = exports.validateComment = exports.validateVideoUpdate = exports.validateVideoUpload = exports.validateUserUpdate = exports.validateUserLogin = exports.validateUserRegistration = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error);
        return next(new errorHandler_1.AppError('Validation failed', 400));
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateUserRegistration = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 20 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
    (0, express_validator_1.body)('displayName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Display name must be 1-50 characters'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
    exports.handleValidationErrors,
];
exports.validateUserLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    exports.handleValidationErrors,
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('displayName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Display name must be 1-50 characters'),
    (0, express_validator_1.body)('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio must be less than 500 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    exports.handleValidationErrors,
];
exports.validateVideoUpload = [
    (0, express_validator_1.body)('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be 1-100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 5000 })
        .withMessage('Description must be less than 5000 characters'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isLength({ min: 1, max: 30 })
        .withMessage('Each tag must be 1-30 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be 1-50 characters'),
    (0, express_validator_1.body)('visibility')
        .optional()
        .isIn(['PUBLIC', 'UNLISTED', 'PRIVATE'])
        .withMessage('Visibility must be PUBLIC, UNLISTED, or PRIVATE'),
    exports.handleValidationErrors,
];
exports.validateVideoUpdate = [
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be 1-100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 5000 })
        .withMessage('Description must be less than 5000 characters'),
    (0, express_validator_1.body)('tags')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 tags allowed'),
    (0, express_validator_1.body)('tags.*')
        .optional()
        .isLength({ min: 1, max: 30 })
        .withMessage('Each tag must be 1-30 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be 1-50 characters'),
    (0, express_validator_1.body)('visibility')
        .optional()
        .isIn(['PUBLIC', 'UNLISTED', 'PRIVATE'])
        .withMessage('Visibility must be PUBLIC, UNLISTED, or PRIVATE'),
    exports.handleValidationErrors,
];
exports.validateComment = [
    (0, express_validator_1.body)('content')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be 1-1000 characters'),
    exports.handleValidationErrors,
];
exports.validatePlaylist = [
    (0, express_validator_1.body)('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be 1-100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('visibility')
        .optional()
        .isIn(['PUBLIC', 'UNLISTED', 'PRIVATE'])
        .withMessage('Visibility must be PUBLIC, UNLISTED, or PRIVATE'),
    exports.handleValidationErrors,
];
exports.validateSearch = [
    (0, express_validator_1.body)('query')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be 1-100 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be 1-50 characters'),
    (0, express_validator_1.body)('duration')
        .optional()
        .isIn(['short', 'medium', 'long'])
        .withMessage('Duration must be short, medium, or long'),
    (0, express_validator_1.body)('sortBy')
        .optional()
        .isIn(['relevance', 'date', 'views', 'rating'])
        .withMessage('Sort by must be relevance, date, views, or rating'),
    exports.handleValidationErrors,
];
exports.validateReport = [
    (0, express_validator_1.body)('reason')
        .isIn(['SPAM', 'INAPPROPRIATE_CONTENT', 'COPYRIGHT', 'HARASSMENT', 'VIOLENCE', 'OTHER'])
        .withMessage('Invalid report reason'),
    (0, express_validator_1.body)('details')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Details must be less than 1000 characters'),
    exports.handleValidationErrors,
];
//# sourceMappingURL=validation.js.map