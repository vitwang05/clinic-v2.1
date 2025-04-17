import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../exceptions';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        if (!user || !user.role || user.role.name !== 'admin') {
            throw new ForbiddenException('Only admin can perform this action');
        }
        next();
    } catch (error) {
        next(error);
    }
}; 