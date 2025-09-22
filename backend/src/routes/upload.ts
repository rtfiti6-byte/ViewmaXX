import express from 'express';
import multer from 'multer';
import {
  uploadVideo,
  uploadThumbnail,
  uploadAvatar,
  getUploadProgress,
  resumeUpload,
  cancelUpload,
  getSignedUrl,
} from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { logEvent } from '../middleware/requestLogger';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedVideoTypes = process.env.ALLOWED_VIDEO_TYPES?.split(',') || [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
    ];
    
    const allowedImageTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (file.fieldname === 'thumbnail' && allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (file.fieldname === 'avatar' && allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

/**
 * @swagger
 * /api/upload/video:
 *   post:
 *     summary: Upload video file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *               - title
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file to upload
 *               title:
 *                 type: string
 *                 description: Video title
 *               description:
 *                 type: string
 *                 description: Video description
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Custom thumbnail (optional)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Video tags
 *               category:
 *                 type: string
 *                 description: Video category
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, UNLISTED, PRIVATE]
 *                 default: PUBLIC
 *     responses:
 *       201:
 *         description: Video upload initiated successfully
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
 *                     videoId:
 *                       type: string
 *                     uploadId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [UPLOADING, PROCESSING]
 *       400:
 *         description: Invalid file or validation error
 *       413:
 *         description: File too large
 */
router.post(
  '/video',
  authenticate,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  logEvent('video_upload_start'),
  uploadVideo
);

/**
 * @swagger
 * /api/upload/thumbnail:
 *   post:
 *     summary: Upload thumbnail image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - thumbnail
 *               - videoId
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               videoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thumbnail uploaded successfully
 */
router.post(
  '/thumbnail',
  authenticate,
  upload.single('thumbnail'),
  logEvent('thumbnail_upload'),
  uploadThumbnail
);

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
router.post(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  logEvent('avatar_upload'),
  uploadAvatar
);

/**
 * @swagger
 * /api/upload/progress/{uploadId}:
 *   get:
 *     summary: Get upload progress
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Upload progress information
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
 *                     uploadId:
 *                       type: string
 *                     progress:
 *                       type: number
 *                       description: Upload progress percentage (0-100)
 *                     status:
 *                       type: string
 *                       enum: [UPLOADING, PROCESSING, COMPLETED, FAILED]
 *                     bytesUploaded:
 *                       type: number
 *                     totalBytes:
 *                       type: number
 *                     estimatedTimeRemaining:
 *                       type: number
 *                       description: Estimated time remaining in seconds
 */
router.get('/progress/:uploadId', authenticate, getUploadProgress);

/**
 * @swagger
 * /api/upload/resume/{uploadId}:
 *   post:
 *     summary: Resume interrupted upload
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Upload resumed successfully
 */
router.post('/resume/:uploadId', authenticate, logEvent('upload_resume'), resumeUpload);

/**
 * @swagger
 * /api/upload/cancel/{uploadId}:
 *   delete:
 *     summary: Cancel upload
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Upload cancelled successfully
 */
router.delete('/cancel/:uploadId', authenticate, logEvent('upload_cancel'), cancelUpload);

/**
 * @swagger
 * /api/upload/signed-url:
 *   post:
 *     summary: Get signed URL for direct S3 upload
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - fileType
 *               - fileSize
 *             properties:
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *               fileSize:
 *                 type: number
 *               uploadType:
 *                 type: string
 *                 enum: [video, thumbnail, avatar]
 *                 default: video
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
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
 *                     signedUrl:
 *                       type: string
 *                       description: Pre-signed URL for direct upload to S3
 *                     uploadId:
 *                       type: string
 *                     fields:
 *                       type: object
 *                       description: Additional form fields for the upload
 */
router.post('/signed-url', authenticate, logEvent('signed_url_request'), getSignedUrl);

export default router;
