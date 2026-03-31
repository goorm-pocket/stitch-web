export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  data: string;
  timestamp: string;
}
