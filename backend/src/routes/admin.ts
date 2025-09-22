import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  banUser,
  unbanUser,
  suspendUser,
  unsuspendUser,
  verifyUser,
  unverifyUser,
  getVideos,
  getVideoById,
  approveVideo,
  rejectVideo,
  deleteVideo,
  getReports,
  getReportById,
  resolveReport,
  dismissReport,
  getAnalytics,
  getSystemLogs,
  getSettings,
  updateSettings,
  getMonetizationStats,
  approveMonetization,
  rejectMonetization,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { logSecurityEvent } from '../middleware/requestLogger';

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticate);
router.use(authorize('ADMIN', 'MODERATOR'));

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                     videos:
 *                       type: object
 *                     revenue:
 *                       type: object
 *                     reports:
 *                       type: object
 */
router.get('/dashboard', getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with filtering
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, banned, suspended]
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, ADMIN, MODERATOR]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [Admin]
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
 *         description: User details
 */
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, MODERATOR]
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/users/:id', logSecurityEvent('admin_user_update', 'medium'), updateUser);

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   post:
 *     summary: Ban user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User banned successfully
 */
router.post('/users/:id/ban', logSecurityEvent('admin_user_ban', 'high'), banUser);

/**
 * @swagger
 * /api/admin/users/{id}/unban:
 *   post:
 *     summary: Unban user
 *     tags: [Admin]
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
 *         description: User unbanned successfully
 */
router.post('/users/:id/unban', logSecurityEvent('admin_user_unban', 'medium'), unbanUser);

/**
 * @swagger
 * /api/admin/users/{id}/suspend:
 *   post:
 *     summary: Suspend user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 description: Suspension duration in days
 *     responses:
 *       200:
 *         description: User suspended successfully
 */
router.post('/users/:id/suspend', logSecurityEvent('admin_user_suspend', 'high'), suspendUser);

router.post('/users/:id/unsuspend', logSecurityEvent('admin_user_unsuspend', 'medium'), unsuspendUser);
router.post('/users/:id/verify', logSecurityEvent('admin_user_verify', 'low'), verifyUser);
router.post('/users/:id/unverify', logSecurityEvent('admin_user_unverify', 'low'), unverifyUser);

// Video management
router.get('/videos', getVideos);
router.get('/videos/:id', getVideoById);
router.post('/videos/:id/approve', logSecurityEvent('admin_video_approve', 'low'), approveVideo);
router.post('/videos/:id/reject', logSecurityEvent('admin_video_reject', 'medium'), rejectVideo);
router.delete('/videos/:id', logSecurityEvent('admin_video_delete', 'high'), deleteVideo);

// Reports management
router.get('/reports', getReports);
router.get('/reports/:id', getReportById);
router.post('/reports/:id/resolve', logSecurityEvent('admin_report_resolve', 'medium'), resolveReport);
router.post('/reports/:id/dismiss', logSecurityEvent('admin_report_dismiss', 'low'), dismissReport);

// Analytics and logs
router.get('/analytics', getAnalytics);
router.get('/logs', authorize('ADMIN'), getSystemLogs);

// Settings
router.get('/settings', getSettings);
router.put('/settings', authorize('ADMIN'), logSecurityEvent('admin_settings_update', 'high'), updateSettings);

// Monetization
router.get('/monetization', getMonetizationStats);
router.post('/monetization/:userId/approve', authorize('ADMIN'), logSecurityEvent('admin_monetization_approve', 'medium'), approveMonetization);
router.post('/monetization/:userId/reject', authorize('ADMIN'), logSecurityEvent('admin_monetization_reject', 'medium'), rejectMonetization);

export default router;