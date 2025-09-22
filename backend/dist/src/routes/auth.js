"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const requestLogger_1 = require("../middleware/requestLogger");
const router = express_1.default.Router();
router.post('/register', validation_1.validateUserRegistration, (0, requestLogger_1.logAuthEvent)('register'), authController_1.register);
router.post('/login', validation_1.validateUserLogin, (0, requestLogger_1.logAuthEvent)('login'), authController_1.login);
router.post('/logout', auth_1.authenticate, (0, requestLogger_1.logAuthEvent)('logout'), authController_1.logout);
router.post('/refresh', authController_1.refreshToken);
router.post('/verify-email', authController_1.verifyEmail);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
router.post('/google', (0, requestLogger_1.logAuthEvent)('google_auth'), authController_1.googleAuth);
router.post('/github', (0, requestLogger_1.logAuthEvent)('github_auth'), authController_1.githubAuth);
exports.default = router;
//# sourceMappingURL=auth.js.map