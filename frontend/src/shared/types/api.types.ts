export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export interface ValidationErrorResponse {
  [field: string]: string;
}
