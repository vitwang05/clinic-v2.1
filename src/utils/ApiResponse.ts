import { ResponseInterface } from '../interfaces/response.interface';

export class ApiResponse {
  static success<T>(data: T, message: string = 'Success', status: number = 200): ResponseInterface<T> {
    return {
      status,
      message,
      data,
    };
  }

  static error(message: string = 'Error', status: number = 500, errors?: any): ResponseInterface<null> {
    return {
      status,
      message,
      errors,
    };
  }
}
