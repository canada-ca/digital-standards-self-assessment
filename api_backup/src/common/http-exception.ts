export interface HttpException extends Error {
  statusCode?: number;
  status?: number;
  message: string;
  error: string | null;
}
