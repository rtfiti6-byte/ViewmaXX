"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const requestLogger_1 = require("../middleware/requestLogger");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
router.get('/profile', auth_1.authenticate, userController_1.getProfile);
router.put('/profile', auth_1.authenticate, validation_1.validateUserUpdate, (0, requestLogger_1.logEvent)('profile_update'), userController_1.updateProfile);
router.post('/avatar', auth_1.authenticate, upload.single('avatar'), (0, requestLogger_1.logEvent)('avatar_upload'), userController_1.uploadAvatar);
router.get('/:id', auth_1.optionalAuth, userController_1.getUserById);
router.get('/:id/videos', auth_1.optionalAuth, userController_1.getUserVideos);
router.get('/:id/playlists', auth_1.optionalAuth, userController_1.getUserPlaylists);
router.post('/:id/subscribe', auth_1.authenticate, (0, requestLogger_1.logEvent)('subscribe'), userController_1.subscribe);
router.post('/:id/unsubscribe', auth_1.authenticate, (0, requestLogger_1.logEvent)('unsubscribe'), userController_1.unsubscribe);
router.get('/subscriptions', auth_1.authenticate, userController_1.getSubscriptions);
router.get('/subscribers', auth_1.authenticate, userController_1.getSubscribers);
router.get('/watch-history', auth_1.authenticate, userController_1.getWatchHistory);
router.get('/watch-later', auth_1.authenticate, userController_1.getWatchLater);
router.post('/watch-later/:videoId', auth_1.authenticate, (0, requestLogger_1.logEvent)('add_watch_later'), userController_1.addToWatchLater);
router.delete('/watch-later/:videoId', auth_1.authenticate, (0, requestLogger_1.logEvent)('remove_watch_later'), userController_1.removeFromWatchLater);
router.get('/notifications', auth_1.authenticate, userController_1.getNotifications);
router.put('/notifications/:id/read', auth_1.authenticate, userController_1.markNotificationRead);
router.put('/notifications/read-all', auth_1.authenticate, userController_1.markAllNotificationsRead);
router.get('/analytics', auth_1.authenticate, userController_1.getUserAnalytics);
router.get('/monetization', auth_1.authenticate, userController_1.getMonetizationData);
exports.default = router;
//# sourceMappingURL=user.js.map