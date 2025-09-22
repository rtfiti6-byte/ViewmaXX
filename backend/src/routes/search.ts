import express from 'express';
import {
  searchVideos,
  searchUsers,
  searchPlaylists,
  getSearchSuggestions,
  globalSearch,
  getPopularSearches,
} from '../controllers/searchController';
import { optionalAuth } from '../middleware/auth';
import { validateSearch } from '../middleware/validation';
import { logEvent } from '../middleware/requestLogger';

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Global search across all content
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           description: Search query
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, videos, users, playlists]
 *           default: all
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
 *           enum: [relevance, date, views, rating]
 *           default: relevance
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *           enum: [short, medium, long]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
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
 *                     results:
 *                       type: array
 *                     pagination:
 *                       type: object
 *                     suggestions:
 *                       type: array
 */
router.get('/', optionalAuth, validateSearch, logEvent('search'), globalSearch);

/**
 * @swagger
 * /api/search/videos:
 *   get:
 *     summary: Search videos
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
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
 *           enum: [relevance, date, views, rating]
 *           default: relevance
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *           enum: [short, medium, long]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video search results
 */
router.get('/videos', optionalAuth, logEvent('search_videos'), searchVideos);

/**
 * @swagger
 * /api/search/users:
 *   get:
 *     summary: Search users
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
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
 *     responses:
 *       200:
 *         description: User search results
 */
router.get('/users', optionalAuth, logEvent('search_users'), searchUsers);

/**
 * @swagger
 * /api/search/playlists:
 *   get:
 *     summary: Search playlists
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
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
 *     responses:
 *       200:
 *         description: Playlist search results
 */
router.get('/playlists', optionalAuth, logEvent('search_playlists'), searchPlaylists);

/**
 * @swagger
 * /api/search/suggestions:
 *   get:
 *     summary: Get search suggestions
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           description: Partial search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search suggestions
 */
router.get('/suggestions', getSearchSuggestions);

/**
 * @swagger
 * /api/search/popular:
 *   get:
 *     summary: Get popular searches
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Popular search queries
 */
router.get('/popular', getPopularSearches);

export default router;