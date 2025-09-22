"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const requestLogger_1 = require("../middleware/requestLogger");
const router = express_1.default.Router();
router.get('/', auth_1.optionalAuth, commentController_1.getComments);
router.post('/', auth_1.authenticate, validation_1.validateComment, (0, requestLogger_1.logEvent)('comment_create'), commentController_1.createComment);
router.put('/:id', auth_1.authenticate, validation_1.validateComment, (0, requestLogger_1.logEvent)('comment_update'), commentController_1.updateComment);
router.delete('/:id', auth_1.authenticate, (0, requestLogger_1.logEvent)('comment_delete'), commentController_1.deleteComment);
router.post('/:id/like', auth_1.authenticate, (0, requestLogger_1.logEvent)('comment_like'), commentController_1.likeComment);
router.post('/:id/dislike', auth_1.authenticate, (0, requestLogger_1.logEvent)('comment_dislike'), commentController_1.dislikeComment);
router.get('/:id/replies', auth_1.optionalAuth, commentController_1.getCommentReplies);
exports.default = router;
//# sourceMappingURL=comment.js.map