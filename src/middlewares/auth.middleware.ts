import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException, ForbiddenException } from '../exceptions';
import * as jwt from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        if (!decoded || !decoded.userId) {
            throw new UnauthorizedException('Invalid token');
        }

        // Attach decoded user info to request
        (req as any).user = decoded;
        next();
    } catch (error) {
        if (error instanceof UnauthorizedException) {
            next(error);
        } else {
            console.error('Auth middleware error:', error);
            next(new UnauthorizedException('Authentication failed'));
        }
    }
};

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user?.role.name;

        if (!allowedRoles.includes(userRole)) {
            throw new ForbiddenException('Insufficient permissions');
        }else{
            console.log("allowed");
        }
        next();
    };
}; 