# ViewmaXX - Video Sharing Platform

🎥 A full-featured video-sharing platform similar to YouTube with advanced monetization and content management features.

## Features

### User Features
- ✅ User registration and login (email + social login)
- ✅ Profile management with avatar and bio
- ✅ Video upload with multiple formats support
- ✅ Adaptive video streaming (HLS/DASH)
- ✅ Advanced search functionality
- ✅ Trending and explore pages
- ✅ Like, dislike, comment, share, subscribe
- ✅ Watch later and playlists
- ✅ Real-time notifications

### Admin Features
- ✅ User management and moderation
- ✅ Content moderation and copyright detection
- ✅ Analytics dashboard
- ✅ Monetization controls
- ✅ Comprehensive reporting

### Monetization
- ✅ Creator monetization (50K views in 30 days, 3+ min videos)
- ✅ Google Ad Manager integration
- ✅ Revenue dashboard and payouts
- ✅ Premium subscriptions support

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Video.js
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + OAuth2 (Google, GitHub)
- **Video Storage**: AWS S3 + CloudFront CDN
- **Video Processing**: FFmpeg with multiple resolutions
- **Search**: Elasticsearch
- **Caching**: Redis
- **Real-time**: Socket.io
- **Deployment**: Docker, Render/AWS ready

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis
- FFmpeg
- AWS Account (for S3)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository>
cd viewmaxx
npm run install-all
```

2. **Environment Setup**
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit the environment files with your configuration
```

3. **Database Setup**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

4. **Start Development**
```bash
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker
npm run docker:build
npm run docker:up
```

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/viewmaxx"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="viewmaxx-videos"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# Elasticsearch
ELASTICSEARCH_URL="http://localhost:9200"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Google Ad Manager
GOOGLE_AD_MANAGER_NETWORK_CODE="your-network-code"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_GITHUB_CLIENT_ID="your-github-client-id"
```

## API Documentation

The API documentation is available at `http://localhost:5000/api/docs` when running in development mode.

## Deployment

### Render Deployment

1. **Create Render Account** and connect your GitHub repository

2. **Set up PostgreSQL Database** on Render

3. **Deploy Backend Service**
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Add all environment variables

4. **Deploy Frontend Service**
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm start`
   - Add environment variables

### AWS Deployment

1. **Set up EC2 instances** or use AWS App Runner
2. **Configure RDS** for PostgreSQL
3. **Set up ElastiCache** for Redis
4. **Configure S3** and CloudFront
5. **Deploy using Docker** or direct deployment

## Project Structure

```
viewmaxx/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
├── database/          # Database schema and migrations
├── docker/            # Docker configuration files
├── docs/              # Documentation
└── scripts/           # Deployment and utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

**Created by MiniMax Agent** 🚀