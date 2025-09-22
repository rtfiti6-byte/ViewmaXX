import express from 'express';
import {
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  shareVideo,
  getTrendingVideos,
  getRecommendedVideos,
  incrementViewCount,
  reportVideo,
  getVideoAnalytics,
  getVideoComments,
} from '../controllers/videoController';
import { authenticate, optionalAuth } from '../middleware/auth';
import {
  validateVideoUpload,
  validateVideoUpdate,
  validateReport,
} from '../middleware/validation';
import { logVideoEvent } from '../middleware/requestLogger';

const router = express.Router();

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get videos with pagination and filtering
 *     tags: [Videos]
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
 *           default: 12
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, views, likes, duration]
 *           default: date
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of videos
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
 *                     videos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Video'
 *                     pagination:
 *                       type: object
 */
router.get('/', optionalAuth, getVideos);

/**
 * @swagger
 * /api/videos/trending:
 *   get:
 *     summary: Get trending videos
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [24h, 7d, 30d]
 *           default: 24h
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Trending videos
 */
router.get('/trending', optionalAuth, getTrendingVideos);

/**
 * @swagger
 * /api/videos/recommended:
 *   get:
 *     summary: Get recommended videos for user
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Recommended videos
 */
router.get('/recommended', authenticate, getRecommendedVideos);

/**
 * @swagger
 * /api/videos/upload:
 *   post:
 *     summary: Upload a new video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - video
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               video:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, UNLISTED, PRIVATE]
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Video'
 */
router.post('/upload', authenticate, validateVideoUpload, logVideoEvent('upload'), uploadVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Video'
 */
router.get('/:id', optionalAuth, logVideoEvent('view'), getVideoById);

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: Update video
 *     tags: [Videos]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, UNLISTED, PRIVATE]
 *     responses:
 *       200:
 *         description: Video updated successfully
 */
router.put('/:id', authenticate, validateVideoUpdate, logVideoEvent('update'), updateVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Delete video
 *     tags: [Videos]
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
 *         description: Video deleted successfully
 */
router.delete('/:id', authenticate, logVideoEvent('delete'), deleteVideo);

/**
 * @swagger
 * /api/videos/{id}/view:
 *   post:
 *     summary: Increment video view count
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: View count incremented
 */
router.post('/:id/view', optionalAuth, logVideoEvent('view_increment'), incrementViewCount);

/**
 * @swagger
 * /api/videos/{id}/like:
 *   post:
 *     summary: Like a video
 *     tags: [Videos]
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
 *         description: Video liked successfully
 */
router.post('/:id/like', authenticate, logVideoEvent('like'), likeVideo);

/**
 * @swagger
 * /api/videos/{id}/dislike:
 *   post:
 *     summary: Dislike a video
 *     tags: [Videos]
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
 *         description: Video disliked successfully
 */
router.post('/:id/dislike', authenticate, logVideoEvent('dislike'), dislikeVideo);

/**
 * @swagger
 * /api/videos/{id}/share:
 *   post:
 *     summary: Share a video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video shared successfully
 */
router.post('/:id/share', optionalAuth, logVideoEvent('share'), shareVideo);

/**
 * @swagger
 * /api/videos/{id}/report:
 *   post:
 *     summary: Report a video
 *     tags: [Videos]
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
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [SPAM, INAPPROPRIATE_CONTENT, COPYRIGHT, HARASSMENT, VIOLENCE, OTHER]
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video reported successfully
 */
router.post('/:id/report', authenticate, validateReport, logVideoEvent('report'), reportVideo);

/**
 * @swagger
 * /api/videos/{id}/comments:
 *   get:
 *     summary: Get video comments
 *     tags: [Videos]
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
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, likes]
 *           default: date
 *     responses:
 *       200:
 *         description: Video comments
 */
router.get('/:id/comments', optionalAuth, getVideoComments);

/**
 * @swagger
 * /api/videos/{id}/analytics:
 *   get:
 *     summary: Get video analytics
 *     tags: [Videos]
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
 *         description: Video analytics data
 */
router.get('/:id/analytics', authenticate, getVideoAnalytics);

export default router;