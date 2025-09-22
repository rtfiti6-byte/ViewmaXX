import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getCommentReplies,
} from '../controllers/commentController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateComment } from '../middleware/validation';
import { logEvent } from '../middleware/requestLogger';

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get comments with pagination
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: videoId
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
 *         description: List of comments
 */
router.get('/', optionalAuth, getComments);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - videoId
 *             properties:
 *               content:
 *                 type: string
 *               videoId:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 description: Parent comment ID for replies
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 */
router.post('/', authenticate, validateComment, logEvent('comment_create'), createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.put('/:id', authenticate, validateComment, logEvent('comment_update'), updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
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
 *         description: Comment deleted successfully
 */
router.delete('/:id', authenticate, logEvent('comment_delete'), deleteComment);

/**
 * @swagger
 * /api/comments/{id}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Comments]
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
 *         description: Comment liked successfully
 */
router.post('/:id/like', authenticate, logEvent('comment_like'), likeComment);

/**
 * @swagger
 * /api/comments/{id}/dislike:
 *   post:
 *     summary: Dislike a comment
 *     tags: [Comments]
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
 *         description: Comment disliked successfully
 */
router.post('/:id/dislike', authenticate, logEvent('comment_dislike'), dislikeComment);

/**
 * @swagger
 * /api/comments/{id}/replies:
 *   get:
 *     summary: Get comment replies
 *     tags: [Comments]
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
 *           default: 10
 *     responses:
 *       200:
 *         description: Comment replies
 */
router.get('/:id/replies', optionalAuth, getCommentReplies);

export default router;
