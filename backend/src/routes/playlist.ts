import express from 'express';
import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  reorderPlaylistVideos,
  getUserPlaylists,
} from '../controllers/playlistController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validatePlaylist } from '../middleware/validation';
import { logEvent } from '../middleware/requestLogger';

const router = express.Router();

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Get public playlists
 *     tags: [Playlists]
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, title, videosCount]
 *           default: date
 *     responses:
 *       200:
 *         description: List of public playlists
 */
router.get('/', optionalAuth, getPlaylists);

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, UNLISTED, PRIVATE]
 *                 default: PUBLIC
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 */
router.post('/', authenticate, validatePlaylist, logEvent('playlist_create'), createPlaylist);

/**
 * @swagger
 * /api/playlists/user/{userId}:
 *   get:
 *     summary: Get user's playlists
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's playlists
 */
router.get('/user/:userId', optionalAuth, getUserPlaylists);

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist data with videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 */
router.get('/:id', optionalAuth, getPlaylistById);

/**
 * @swagger
 * /api/playlists/{id}:
 *   put:
 *     summary: Update playlist
 *     tags: [Playlists]
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
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, UNLISTED, PRIVATE]
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 */
router.put('/:id', authenticate, validatePlaylist, logEvent('playlist_update'), updatePlaylist);

/**
 * @swagger
 * /api/playlists/{id}:
 *   delete:
 *     summary: Delete playlist
 *     tags: [Playlists]
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
 *         description: Playlist deleted successfully
 */
router.delete('/:id', authenticate, logEvent('playlist_delete'), deletePlaylist);

/**
 * @swagger
 * /api/playlists/{id}/videos:
 *   post:
 *     summary: Add video to playlist
 *     tags: [Playlists]
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
 *               - videoId
 *             properties:
 *               videoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video added to playlist
 */
router.post('/:id/videos', authenticate, logEvent('playlist_add_video'), addVideoToPlaylist);

/**
 * @swagger
 * /api/playlists/{id}/videos/{videoId}:
 *   delete:
 *     summary: Remove video from playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video removed from playlist
 */
router.delete('/:id/videos/:videoId', authenticate, logEvent('playlist_remove_video'), removeVideoFromPlaylist);

/**
 * @swagger
 * /api/playlists/{id}/reorder:
 *   put:
 *     summary: Reorder videos in playlist
 *     tags: [Playlists]
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
 *               - videoOrders
 *             properties:
 *               videoOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     videoId:
 *                       type: string
 *                     position:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Playlist videos reordered
 */
router.put('/:id/reorder', authenticate, logEvent('playlist_reorder'), reorderPlaylistVideos);

export default router;
