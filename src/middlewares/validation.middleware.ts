// middlewares/validateDTO.ts
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions';

export const validateDTO = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToClass(dtoClass, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
            throw new BadRequestException(message);
        }

        (req as any).body = dto;
        next();
    };
};