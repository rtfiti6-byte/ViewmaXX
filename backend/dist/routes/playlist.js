"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playlistController_1 = require("../controllers/playlistController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const requestLogger_1 = require("../middleware/requestLogger");
const router = express_1.default.Router();
router.get('/', auth_1.optionalAuth, playlistController_1.getPlaylists);
router.post('/', auth_1.authenticate, validation_1.validatePlaylist, (0, requestLogger_1.logEvent)('playlist_create'), playlistController_1.createPlaylist);
router.get('/user/:userId', auth_1.optionalAuth, playlistController_1.getUserPlaylists);
router.get('/:id', auth_1.optionalAuth, playlistController_1.getPlaylistById);
router.put('/:id', auth_1.authenticate, validation_1.validatePlaylist, (0, requestLogger_1.logEvent)('playlist_update'), playlistController_1.updatePlaylist);
router.delete('/:id', auth_1.authenticate, (0, requestLogger_1.logEvent)('playlist_delete'), playlistController_1.deletePlaylist);
router.post('/:id/videos', auth_1.authenticate, (0, requestLogger_1.logEvent)('playlist_add_video'), playlistController_1.addVideoToPlaylist);
router.delete('/:id/videos/:videoId', auth_1.authenticate, (0, requestLogger_1.logEvent)('playlist_remove_video'), playlistController_1.removeVideoFromPlaylist);
router.put('/:id/reorder', auth_1.authenticate, (0, requestLogger_1.logEvent)('playlist_reorder'), playlistController_1.reorderPlaylistVideos);
exports.default = router;
//# sourceMappingURL=playlist.js.map