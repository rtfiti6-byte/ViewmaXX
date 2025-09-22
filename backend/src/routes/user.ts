import express from 'express';
import {
  getProfile,
  updateProfile,
  getUserById,
  getUserVideos,
  getUserPlaylists,
  subscribe,
  unsubscribe,
  getSubscriptions,
  getSubscribers,
  uploadAvatar,
  getWatchHistory,
  getWatchLater,
  addToWatchLater,
  removeFromWatchLater,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUserAnalytics,
  getMonetizationData,
} from '../controllers/userController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateUserUpdate } from '../middleware/validation';
import { logEvent } from '../middleware/requestLogger';
import multer from 'multer';

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/profile', authenticate, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               bio:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', authenticate, validateUserUpdate, logEvent('profile_update'), updateProfile);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
router.post('/avatar', authenticate, upload.single('avatar'), logEvent('avatar_upload'), uploadAvatar);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 */
router.get('/:id', optionalAuth, getUserById);

/**
 * @swagger
 * /api/users/{id}/videos:
 *   get:
 *     summary: Get user's videos
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: User's videos
 */
router.get('/:id/videos', optionalAuth, getUserVideos);

/**
 * @swagger
 * /api/users/{id}/playlists:
 *   get:
 *     summary: Get user's playlists
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's playlists
 */
router.get('/:id/playlists', optionalAuth, getUserPlaylists);

/**
 * @swagger
 * /api/users/{id}/subscribe:
 *   post:
 *     summary: Subscribe to user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscribed successfully
 */
router.post('/:id/subscribe', authenticate, logEvent('subscribe'), subscribe);

/**
 * @swagger
 * /api/users/{id}/unsubscribe:
 *   post:
 *     summary: Unsubscribe from user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 */
router.post('/:id/unsubscribe', authenticate, logEvent('unsubscribe'), unsubscribe);

/**
 * @swagger
 * /api/users/subscriptions:
 *   get:
 *     summary: Get user's subscriptions
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's subscriptions
 */
router.get('/subscriptions', authenticate, getSubscriptions);

/**
 * @swagger
 * /api/users/subscribers:
 *   get:
 *     summary: Get user's subscribers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's subscribers
 */
router.get('/subscribers', authenticate, getSubscribers);

/**
 * @swagger
 * /api/users/watch-history:
 *   get:
 *     summary: Get user's watch history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's watch history
 */
router.get('/watch-history', authenticate, getWatchHistory);

/**
 * @swagger
 * /api/users/watch-later:
 *   get:
 *     summary: Get watch later videos
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watch later videos
 */
router.get('/watch-later', authenticate, getWatchLater);

/**
 * @swagger
 * /api/users/watch-later/{videoId}:
 *   post:
 *     summary: Add video to watch later
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Added to watch later
 */
router.post('/watch-later/:videoId', authenticate, logEvent('add_watch_later'), addToWatchLater);

/**
 * @swagger
 * /api/users/watch-later/{videoId}:
 *   delete:
 *     summary: Remove video from watch later
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from watch later
 */
router.delete('/watch-later/:videoId', authenticate, logEvent('remove_watch_later'), removeFromWatchLater);

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User notifications
 */
router.get('/notifications', authenticate, getNotifications);

/**
 * @swagger
 * /api/users/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.put('/notifications/:id/read', authenticate, markNotificationRead);

/**
 * @swagger
 * /api/users/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/notifications/read-all', authenticate, markAllNotificationsRead);

/**
 * @swagger
 * /api/users/analytics:
 *   get:
 *     summary: Get user analytics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User analytics data
 */
router.get('/analytics', authenticate, getUserAnalytics);

/**
 * @swagger
 * /api/users/monetization:
 *   get:
 *     summary: Get monetization data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monetization data
 */
router.get('/monetization', authenticate, getMonetizationData);

export default router;