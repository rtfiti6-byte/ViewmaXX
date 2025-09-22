"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ViewmaXX API',
            version: '1.0.0',
            description: 'A comprehensive video sharing platform API similar to YouTube',
            contact: {
                name: 'MiniMax Agent',
                email: 'support@viewmaxx.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: process.env.BACKEND_URL || 'http://localhost:5000',
                description: 'Development server',
            },
            {
                url: 'https://api.viewmaxx.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique user identifier',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                        username: {
                            type: 'string',
                            description: 'Unique username',
                        },
                        displayName: {
                            type: 'string',
                            description: 'Display name',
                        },
                        avatar: {
                            type: 'string',
                            format: 'uri',
                            description: 'Avatar image URL',
                        },
                        bio: {
                            type: 'string',
                            description: 'User biography',
                        },
                        isVerified: {
                            type: 'boolean',
                            description: 'Whether user is verified',
                        },
                        subscribersCount: {
                            type: 'integer',
                            description: 'Number of subscribers',
                        },
                        subscribingCount: {
                            type: 'integer',
                            description: 'Number of subscriptions',
                        },
                        totalViews: {
                            type: 'integer',
                            description: 'Total video views',
                        },
                        totalVideos: {
                            type: 'integer',
                            description: 'Total videos uploaded',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Account creation date',
                        },
                    },
                },
                Video: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique video identifier',
                        },
                        title: {
                            type: 'string',
                            description: 'Video title',
                        },
                        description: {
                            type: 'string',
                            description: 'Video description',
                        },
                        thumbnail: {
                            type: 'string',
                            format: 'uri',
                            description: 'Thumbnail image URL',
                        },
                        duration: {
                            type: 'integer',
                            description: 'Video duration in seconds',
                        },
                        views: {
                            type: 'integer',
                            description: 'Number of views',
                        },
                        likes: {
                            type: 'integer',
                            description: 'Number of likes',
                        },
                        dislikes: {
                            type: 'integer',
                            description: 'Number of dislikes',
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Video tags',
                        },
                        category: {
                            type: 'string',
                            description: 'Video category',
                        },
                        status: {
                            type: 'string',
                            enum: ['UPLOADING', 'PROCESSING', 'PROCESSED', 'FAILED', 'PUBLISHED'],
                            description: 'Video processing status',
                        },
                        visibility: {
                            type: 'string',
                            enum: ['PUBLIC', 'UNLISTED', 'PRIVATE'],
                            description: 'Video visibility',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Upload date',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        content: {
                            type: 'string',
                            description: 'Comment content',
                        },
                        likes: {
                            type: 'integer',
                            description: 'Number of likes',
                        },
                        dislikes: {
                            type: 'integer',
                            description: 'Number of dislikes',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                        replies: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Comment',
                            },
                        },
                    },
                },
                Playlist: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        title: {
                            type: 'string',
                            description: 'Playlist title',
                        },
                        description: {
                            type: 'string',
                            description: 'Playlist description',
                        },
                        thumbnail: {
                            type: 'string',
                            format: 'uri',
                            description: 'Playlist thumbnail URL',
                        },
                        visibility: {
                            type: 'string',
                            enum: ['PUBLIC', 'UNLISTED', 'PRIVATE'],
                        },
                        videosCount: {
                            type: 'integer',
                            description: 'Number of videos in playlist',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                    },
                                    message: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            description: 'Success message',
                        },
                        data: {
                            type: 'object',
                            description: 'Response data',
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
//# sourceMappingURL=swagger.js.map