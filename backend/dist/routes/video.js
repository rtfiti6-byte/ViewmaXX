"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videoController_1 = require("../controllers/videoController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const requestLogger_1 = require("../middleware/requestLogger");
const router = express_1.default.Router();
router.get('/', auth_1.optionalAuth, videoController_1.getVideos);
router.get('/trending', auth_1.optionalAuth, videoController_1.getTrendingVideos);
router.get('/recommended', auth_1.authenticate, videoController_1.getRecommendedVideos);
router.post('/upload', auth_1.authenticate, validation_1.validateVideoUpload, (0, requestLogger_1.logVideoEvent)('upload'), videoController_1.uploadVideo);
router.get('/:id', auth_1.optionalAuth, (0, requestLogger_1.logVideoEvent)('view'), videoController_1.getVideoById);
router.put('/:id', auth_1.authenticate, validation_1.validateVideoUpdate, (0, requestLogger_1.logVideoEvent)('update'), videoController_1.updateVideo);
router.delete('/:id', auth_1.authenticate, (0, requestLogger_1.logVideoEvent)('delete'), videoController_1.deleteVideo);
router.post('/:id/view', auth_1.optionalAuth, (0, requestLogger_1.logVideoEvent)('view_increment'), videoController_1.incrementViewCount);
router.post('/:id/like', auth_1.authenticate, (0, requestLogger_1.logVideoEvent)('like'), videoController_1.likeVideo);
router.post('/:id/dislike', auth_1.authenticate, (0, requestLogger_1.logVideoEvent)('dislike'), videoController_1.dislikeVideo);
router.post('/:id/share', auth_1.optionalAuth, (0, requestLogger_1.logVideoEvent)('share'), videoController_1.shareVideo);
router.post('/:id/report', auth_1.authenticate, validation_1.validateReport, (0, requestLogger_1.logVideoEvent)('report'), videoController_1.reportVideo);
router.get('/:id/comments', auth_1.optionalAuth, videoController_1.getVideoComments);
router.get('/:id/analytics', auth_1.authenticate, videoController_1.getVideoAnalytics);
exports.default = router;
//# sourceMappingURL=video.js.map