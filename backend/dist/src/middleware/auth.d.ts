import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export declare const generateTokens: (user: any) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const refreshTokens: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const revokeToken: (userId: string) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map