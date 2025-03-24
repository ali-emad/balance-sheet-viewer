import axios from "axios";
import { BalanceSheetResponse } from "../types/balanceSheet";

interface ApiError {
  detail: {
    message: string;
    type: string;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBalanceSheet = async (
  params: PaginationParams = { page: 1, pageSize: 10 }
): Promise<BalanceSheetResponse> => {
  try {
    const { page, pageSize } = params;
    const response = await api.get<BalanceSheetResponse>(`/api/balance-sheet`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      throw new Error(
        apiError?.detail?.message || "Failed to fetch balance sheet"
      );
    }
    throw error;
  }
};
