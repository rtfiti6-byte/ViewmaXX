import { Socket } from 'socket.io';
declare module 'socket.io' {
    interface Socket {
        userId?: string;
        user?: any;
    }
}
export declare const authSocket: (socket: Socket, next: any) => Promise<any>;
export declare const optionalAuthSocket: (socket: Socket, next: any) => Promise<any>;
//# sourceMappingURL=socketAuth.d.ts.map