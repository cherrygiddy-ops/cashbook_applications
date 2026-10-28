
import type { CashbookResponseDto } from "@/entities/CashbookResponseDto";
import { axiosInstance } from "./ApiClient";


const CashbookService = {
  getAllAccessible: async (): Promise<CashbookResponseDto[]> => {
    const response = await axiosInstance.get<CashbookResponseDto[]>(
      "api/cashbooks",
    );

    return response.data;
  },

  getByBusinessId: async (
    businessId: number | string,
  ): Promise<CashbookResponseDto[]> => {
    const response = await axiosInstance.get<CashbookResponseDto[]>(
      `api/businesses/${businessId}/cashbooks`,
    );

    return response.data;
  },
};

export default CashbookService;
