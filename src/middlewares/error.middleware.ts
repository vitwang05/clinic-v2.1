import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';
import { ApiResponse } from '../utils/ApiResponse';

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json(ApiResponse.error(message, status));
};
