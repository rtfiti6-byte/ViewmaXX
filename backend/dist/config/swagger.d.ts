export declare const swaggerOptions: {
    definition: {
        openapi: string;
        info: {
            title: string;
            version: string;
            description: string;
            contact: {
                name: string;
                email: string;
            };
            license: {
                name: string;
                url: string;
            };
        };
        servers: {
            url: string;
            description: string;
        }[];
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: string;
                    scheme: string;
                    bearerFormat: string;
                };
                cookieAuth: {
                    type: string;
                    in: string;
                    name: string;
                };
            };
            schemas: {
                User: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        email: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        username: {
                            type: string;
                            description: string;
                        };
                        displayName: {
                            type: string;
                            description: string;
                        };
                        avatar: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        bio: {
                            type: string;
                            description: string;
                        };
                        isVerified: {
                            type: string;
                            description: string;
                        };
                        subscribersCount: {
                            type: string;
                            description: string;
                        };
                        subscribingCount: {
                            type: string;
                            description: string;
                        };
                        totalViews: {
                            type: string;
                            description: string;
                        };
                        totalVideos: {
                            type: string;
                            description: string;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                            description: string;
                        };
                    };
                };
                Video: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        title: {
                            type: string;
                            description: string;
                        };
                        description: {
                            type: string;
                            description: string;
                        };
                        thumbnail: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        duration: {
                            type: string;
                            description: string;
                        };
                        views: {
                            type: string;
                            description: string;
                        };
                        likes: {
                            type: string;
                            description: string;
                        };
                        dislikes: {
                            type: string;
                            description: string;
                        };
                        tags: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                        category: {
                            type: string;
                            description: string;
                        };
                        status: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                        visibility: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        user: {
                            $ref: string;
                        };
                    };
                };
                Comment: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            format: string;
                        };
                        content: {
                            type: string;
                            description: string;
                        };
                        likes: {
                            type: string;
                            description: string;
                        };
                        dislikes: {
                            type: string;
                            description: string;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                        };
                        user: {
                            $ref: string;
                        };
                        replies: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                    };
                };
                Playlist: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            format: string;
                        };
                        title: {
                            type: string;
                            description: string;
                        };
                        description: {
                            type: string;
                            description: string;
                        };
                        thumbnail: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        visibility: {
                            type: string;
                            enum: string[];
                        };
                        videosCount: {
                            type: string;
                            description: string;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                        };
                        user: {
                            $ref: string;
                        };
                    };
                };
                Error: {
                    type: string;
                    properties: {
                        success: {
                            type: string;
                            example: boolean;
                        };
                        message: {
                            type: string;
                            description: string;
                        };
                        errors: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    field: {
                                        type: string;
                                    };
                                    message: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                Success: {
                    type: string;
                    properties: {
                        success: {
                            type: string;
                            example: boolean;
                        };
                        message: {
                            type: string;
                            description: string;
                        };
                        data: {
                            type: string;
                            description: string;
                        };
                    };
                };
            };
        };
        security: {
            bearerAuth: never[];
        }[];
    };
    apis: string[];
};
//# sourceMappingURL=swagger.d.ts.map