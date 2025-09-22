import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from './errorHandler';

// Handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));
    
    return next(new AppError('Validation failed', 400));
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be 1-50 characters'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  handleValidationErrors,
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

export const validateUserUpdate = [
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be 1-50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors,
];

// Video validation rules
export const validateVideoUpload = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Maximum 10 tags allowed'),
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be 1-30 characters'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be 1-50 characters'),
  body('visibility')
    .optional()
    .isIn(['PUBLIC', 'UNLISTED', 'PRIVATE'])
    .withMessage('Visibility must be PUBLIC, UNLISTED, or PRIVATE'),
  handleValidationErrors,
];

export const validateVideoUpdate = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Maximum 10 tags allowed'),
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be 1-30 characters'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be 1-50 characters'),
  body('visibility')
    .optional()
    .isIn(['PUBLIC', 'UNLISTED', 'PRIVATE'])
    .withMessage('Visibility must be PUBLIC, UNLISTED, or PRIVATE'),
  handleValidationErrors,
];

// Comment validation rules
export const validateComment = [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be 1-1000 characters'),
  handleValidationErrors,
];

// Playlist validation rules
export const validatePlaylist = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('visibility')
    .optional()
    .isIn(['PUBLIC', 'UNLISTED', 'PRIVATE'])
    .withMessage('Visibility must be PUBLIC, UNLISTED, or PRIVATE'),
  handleValidationErrors,
];

// Search validation rules
export const validateSearch = [
  body('query')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be 1-100 characters'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be 1-50 characters'),
  body('duration')
    .optional()
    .isIn(['short', 'medium', 'long'])
    .withMessage('Duration must be short, medium, or long'),
  body('sortBy')
    .optional()
    .isIn(['relevance', 'date', 'views', 'rating'])
    .withMessage('Sort by must be relevance, date, views, or rating'),
  handleValidationErrors,
];

// Report validation rules
export const validateReport = [
  body('reason')
    .isIn(['SPAM', 'INAPPROPRIATE_CONTENT', 'COPYRIGHT', 'HARASSMENT', 'VIOLENCE', 'OTHER'])
    .withMessage('Invalid report reason'),
  body('details')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Details must be less than 1000 characters'),
  handleValidationErrors,
];