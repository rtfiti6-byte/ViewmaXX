# ViewmaXX Backend

The backend API for the ViewmaXX video sharing platform.

## Features

- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- JWT authentication with refresh tokens
- OAuth2 integration (Google, GitHub)
- Video upload and processing with FFmpeg
- AWS S3 integration for file storage
- Redis caching and session management
- Elasticsearch for search functionality
- Socket.io for real-time features
- Comprehensive API documentation with Swagger
- Rate limiting and security middleware
- Email notifications
- Content moderation and copyright detection
- Monetization system
- Admin dashboard APIs

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis
- FFmpeg
- AWS Account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

4. Start development server:
```bash
npm run dev
```

## API Documentation

API documentation is available at `http://localhost:5000/api/docs` when running the server.

## Project Structure

```
src/
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── config/          # Configuration files
└── types/           # TypeScript type definitions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier