import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import RedisStore from 'connect-redis';
import dotenv from 'dotenv';

// Import configurations and middleware
import { redisClient } from './config/redis';
import { logger } from './config/logger';
import { swaggerOptions } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authSocket } from './middleware/socketAuth';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import videoRoutes from './routes/video';
import commentRoutes from './routes/comment';
import playlistRoutes from './routes/playlist';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import uploadRoutes from './routes/upload';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Session configuration
const sessionConfig = {
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24 hours
  },
};

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(limiter);
app.use(requestLogger);

// Swagger documentation
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.io authentication middleware
io.use(authSocket);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.userId}`);

  // Join user to their personal room for notifications
  socket.join(`user:${socket.userId}`);

  // Handle video watching events
  socket.on('watch_video', (data) => {
    const { videoId, userId } = data;
    socket.join(`video:${videoId}`);
    
    // Broadcast to other viewers that someone is watching
    socket.to(`video:${videoId}`).emit('viewer_joined', {
      userId,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle real-time comments
  socket.on('new_comment', (data) => {
    const { videoId, comment } = data;
    socket.to(`video:${videoId}`).emit('comment_added', comment);
  });

  // Handle live chat for premium users
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

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.userId}`);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 ViewmaXX Backend Server running on port ${PORT}`);
  logger.info(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Shutting down gracefully...');
  
  server.close(() => {
    logger.info('✅ HTTP server closed');
  });
  
  await redisClient.quit();
  logger.info('✅ Redis connection closed');
  
  process.exit(0);
});

export { io };