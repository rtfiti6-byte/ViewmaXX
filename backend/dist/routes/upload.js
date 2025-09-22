"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("../controllers/uploadController");
const auth_1 = require("../middleware/auth");
const requestLogger_1 = require("../middleware/requestLogger");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024,
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
        }
        else if (file.fieldname === 'thumbnail' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else if (file.fieldname === 'avatar' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    },
});
router.post('/video', auth_1.authenticate, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), (0, requestLogger_1.logEvent)('video_upload_start'), uploadController_1.uploadVideo);
router.post('/thumbnail', auth_1.authenticate, upload.single('thumbnail'), (0, requestLogger_1.logEvent)('thumbnail_upload'), uploadController_1.uploadThumbnail);
router.post('/avatar', auth_1.authenticate, upload.single('avatar'), (0, requestLogger_1.logEvent)('avatar_upload'), uploadController_1.uploadAvatar);
router.get('/progress/:uploadId', auth_1.authenticate, uploadController_1.getUploadProgress);
router.post('/resume/:uploadId', auth_1.authenticate, (0, requestLogger_1.logEvent)('upload_resume'), uploadController_1.resumeUpload);
router.delete('/cancel/:uploadId', auth_1.authenticate, (0, requestLogger_1.logEvent)('upload_cancel'), uploadController_1.cancelUpload);
router.post('/signed-url', auth_1.authenticate, (0, requestLogger_1.logEvent)('signed_url_request'), uploadController_1.getSignedUrl);
exports.default = router;
//# sourceMappingURL=upload.js.map