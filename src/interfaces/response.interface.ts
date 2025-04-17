export interface ResponseInterface<T> {
  status: number;
  message: string;
  data?: T;
  errors?: any;
}
