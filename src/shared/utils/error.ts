import axios from "axios";
import type { ApiErrorResponse } from "../types/common.type";

export const getApiErrorMessage = (error: unknown, fallbackMessage = "문제가 발생했어요.") => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
