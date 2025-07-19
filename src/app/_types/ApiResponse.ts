import { AppErrorCodes } from "./AppErrorCodes";

export interface ErrorContext {
  appErrorCode: string;
  description: string;
  metadata?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  payload: T;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  payload: null;
  error: ErrorContext;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

class ApiResponseBuilder<T> {
  private response: ApiResponse<T>;

  private constructor(response: ApiResponse<T>) {
    this.response = response;
  }

  static success<T>(data: T): ApiResponseBuilder<T> {
    return new ApiResponseBuilder<T>({
      success: true,
      payload: data,
      error: null,
    });
  }

  static error(
    appErrorCode: string = AppErrorCodes.INTERNAL_SERVER_ERROR,
  ): ApiResponseBuilder<never> {
    return new ApiResponseBuilder<never>({
      success: false,
      payload: null,
      error: {
        appErrorCode,
        description: "",
      },
    });
  }

  withDescription(description: string): this {
    if (this.response.success === false) {
      this.response.error.description = description;
    }
    return this;
  }

  withMetadata(metadata: unknown): this {
    if (this.response.success === false) {
      this.response.error.metadata = metadata;
    }
    return this;
  }

  build(): ApiResponse<T> {
    return this.response;
  }
}

export { ApiResponseBuilder };
