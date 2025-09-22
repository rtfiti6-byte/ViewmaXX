import express from 'express';
import {
  recordAnalyticsEvent,
  getUserAnalytics,
  getVideoAnalytics,
  getChannelAnalytics,
  getRevenueAnalytics,
  getAudienceAnalytics,
  getTrafficAnalytics,
  getEngagementAnalytics,
  getPerformanceMetrics,
  exportAnalyticsData,
} from '../controllers/analyticsController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { logEvent } from '../middleware/requestLogger';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/event:
 *   post:
 *     summary: Record analytics event
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - data
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [VIDEO_VIEW, VIDEO_LIKE, VIDEO_DISLIKE, VIDEO_COMMENT, VIDEO_SHARE, USER_REGISTER, USER_LOGIN, VIDEO_UPLOAD, SUBSCRIPTION]
 *               data:
 *                 type: object
 *               videoId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event recorded successfully
 */
router.post('/event', optionalAuth, recordAnalyticsEvent);

/**
 * @swagger
 * /api/analytics/user:
 *   get:
 *     summary: Get user analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [views, subscribers, revenue, engagement]
 *     responses:
 *       200:
 *         description: User analytics data
 */
router.get('/user', authenticate, getUserAnalytics);

/**
 * @swagger
 * /api/analytics/video/{videoId}:
 *   get:
 *     summary: Get video analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Video analytics data
 */
router.get('/video/:videoId', authenticate, getVideoAnalytics);

/**
 * @swagger
 * /api/analytics/channel:
 *   get:
 *     summary: Get channel analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Channel analytics data
 */
router.get('/channel', authenticate, getChannelAnalytics);

/**
 * @swagger
 * /api/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Revenue analytics data
 */
router.get('/revenue', authenticate, getRevenueAnalytics);

/**
 * @swagger
 * /api/analytics/audience:
 *   get:
 *     summary: Get audience analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Audience analytics data
 */
router.get('/audience', authenticate, getAudienceAnalytics);

/**
 * @swagger
 * /api/analytics/traffic:
 *   get:
 *     summary: Get traffic analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Traffic analytics data
 */
router.get('/traffic', authenticate, getTrafficAnalytics);

/**
 * @swagger
 * /api/analytics/engagement:
 *   get:
 *     summary: Get engagement analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *     responses:
 *       200:
 *         description: Engagement analytics data
 */
router.get('/engagement', authenticate, getEngagementAnalytics);

/**
 * @swagger
 * /api/analytics/performance:
 *   get:
 *     summary: Get performance metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics
 */
router.get('/performance', authenticate, getPerformanceMetrics);

/**
 * @swagger
 * /api/analytics/export:
 *   get:
 *     summary: Export analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json, xlsx]
 *           default: csv
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [video, channel, revenue, audience]
 *     responses:
 *       200:
 *         description: Analytics data export
 */
router.get('/export', authenticate, logEvent('analytics_export'), exportAnalyticsData);

export default router;