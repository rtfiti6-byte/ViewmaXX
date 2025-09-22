"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("./config/redis");
const logger_1 = require("./config/logger");
const swagger_1 = require("./config/swagger");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const socketAuth_1 = require("./middleware/socketAuth");
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const video_1 = __importDefault(require("./routes/video"));
const comment_1 = __importDefault(require("./routes/comment"));
const playlist_1 = __importDefault(require("./routes/playlist"));
const search_1 = __importDefault(require("./routes/search"));
const admin_1 = __importDefault(require("./routes/admin"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    },
});
exports.io = io;
const PORT = process.env.PORT || 5000;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const sessionConfig = {
    store: new connect_redis_1.default({ client: redis_1.redisClient }),
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'),
    },
};
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)(sessionConfig));
app.use(limiter);
app.use(requestLogger_1.requestLogger);
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.swaggerOptions);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/videos', video_1.default);
app.use('/api/comments', comment_1.default);
app.use('/api/playlists', playlist_1.default);
app.use('/api/search', search_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/upload', upload_1.default);
io.use(socketAuth_1.authSocket);
io.on('connection', (socket) => {
    logger_1.logger.info(`User connected: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);
    socket.on('watch_video', (data) => {
        const { videoId, userId } = data;
        socket.join(`video:${videoId}`);
        socket.to(`video:${videoId}`).emit('viewer_joined', {
            userId,
            timestamp: new Date().toISOString(),
        });
    });
    socket.on('new_comment', (data) => {
        const { videoId, comment } = data;
        socket.to(`video:${videoId}`).emit('comment_added', comment);
    });
    socket.on('join_live_chat', (data) => {
        const { videoId } = data;
        socket.join(`live:${videoId}`);
    });
    socket.on('live_message', (data) => {
        const { videoId, message } = data;
        io.to(`live:${videoId}`).emit('live_message', {
            ...message,
            userId: socket.userId,
            timestamp: new Date().toISOString(),
        });
    });
    socket.on('disconnect', () => {
        logger_1.logger.info(`User disconnected: ${socket.userId}`);
    });
});
app.use(errorHandler_1.errorHandler);
server.listen(PORT, () => {
    logger_1.logger.info(`🚀 ViewmaXX Backend Server running on port ${PORT}`);
    logger_1.logger.info(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
    logger_1.logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('🛑 Shutting down gracefully...');
    server.close(() => {
        logger_1.logger.info('✅ HTTP server closed');
    });
    await redis_1.redisClient.quit();
    logger_1.logger.info('✅ Redis connection closed');
    process.exit(0);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    logger_1.logger.error('Uncaught Exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
//# sourceMappingURL=server.js.map