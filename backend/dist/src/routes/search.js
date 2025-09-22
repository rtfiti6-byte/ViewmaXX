"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchController_1 = require("../controllers/searchController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const requestLogger_1 = require("../middleware/requestLogger");
const router = express_1.default.Router();
router.get('/', auth_1.optionalAuth, validation_1.validateSearch, (0, requestLogger_1.logEvent)('search'), searchController_1.globalSearch);
router.get('/videos', auth_1.optionalAuth, (0, requestLogger_1.logEvent)('search_videos'), searchController_1.searchVideos);
router.get('/users', auth_1.optionalAuth, (0, requestLogger_1.logEvent)('search_users'), searchController_1.searchUsers);
router.get('/playlists', auth_1.optionalAuth, (0, requestLogger_1.logEvent)('search_playlists'), searchController_1.searchPlaylists);
router.get('/suggestions', searchController_1.getSearchSuggestions);
router.get('/popular', searchController_1.getPopularSearches);
exports.default = router;
//# sourceMappingURL=search.js.map