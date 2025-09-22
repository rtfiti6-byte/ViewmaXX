import { Request, Response, NextFunction } from 'express';
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const logEvent: (eventType: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const logVideoEvent: (eventType: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const logAuthEvent: (eventType: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const logSecurityEvent: (eventType: string, severity: "low" | "medium" | "high") => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requestLogger.d.ts.map