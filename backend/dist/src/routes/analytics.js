"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middleware/auth");
const requestLogger_1 = require("../middleware/requestLogger");
const router = express_1.default.Router();
router.post('/event', auth_1.optionalAuth, analyticsController_1.recordAnalyticsEvent);
router.get('/user', auth_1.authenticate, analyticsController_1.getUserAnalytics);
router.get('/video/:videoId', auth_1.authenticate, analyticsController_1.getVideoAnalytics);
router.get('/channel', auth_1.authenticate, analyticsController_1.getChannelAnalytics);
router.get('/revenue', auth_1.authenticate, analyticsController_1.getRevenueAnalytics);
router.get('/audience', auth_1.authenticate, analyticsController_1.getAudienceAnalytics);
router.get('/traffic', auth_1.authenticate, analyticsController_1.getTrafficAnalytics);
router.get('/engagement', auth_1.authenticate, analyticsController_1.getEngagementAnalytics);
router.get('/performance', auth_1.authenticate, analyticsController_1.getPerformanceMetrics);
router.get('/export', auth_1.authenticate, (0, requestLogger_1.logEvent)('analytics_export'), analyticsController_1.exportAnalyticsData);
exports.default = router;
//# sourceMappingURL=analytics.js.map