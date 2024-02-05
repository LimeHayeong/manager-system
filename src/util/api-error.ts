import { ApiError } from "./types/response";

export function createApiError(message: string, error: string): ApiError {
  return {
    success: false,
    message,
    error,
  }
}
