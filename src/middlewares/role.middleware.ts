import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../exceptions';

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            console.log(user);
            if (!user || !user.role || !allowedRoles.includes(user.role.name)) {
                throw new ForbiddenException(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

// Convenience functions for common role checks
export const requireAdmin = checkRole(['admin']);
export const requireDoctor = checkRole(['doctor']);
export const requireReceptionist = checkRole(['receptionist']);
export const requirePatient = checkRole(['patient']);
export const requireStaff = checkRole(['doctor', 'receptionist', 'admin']); 