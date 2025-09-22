import winston from 'winston';
export declare const logger: winston.Logger;
export declare const loggerHelpers: {
    logRequest: (req: any, res: any, responseTime: number) => void;
    logAuth: (event: string, userId?: string, details?: any) => void;
    logVideo: (event: string, videoId: string, userId?: string, details?: any) => void;
    logError: (error: Error, context?: any) => void;
    logSecurity: (event: string, severity: "low" | "medium" | "high", details?: any) => void;
    logPerformance: (operation: string, duration: number, details?: any) => void;
};
//# sourceMappingURL=logger.d.ts.map