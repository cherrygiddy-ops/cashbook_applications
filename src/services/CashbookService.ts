import type { CashbookRequestDto } from "@/entities/CashbookRequestDto";
import type { CashbookResponseDto } from "@/entities/CashbookResponseDto";
import APICLIENT, { axiosInstance } from "./ApiClient";


const apiClient = new APICLIENT<
  CashbookRequestDto,
  CashbookResponseDto
>("/api/cashbooks");

const getByBusinessId = async (
  businessId: number | string,
): Promise<CashbookResponseDto[]> => {
  const response = await axiosInstance.get<CashbookResponseDto[]>(
    `/api/cashbooks/business/${businessId}`,
  );

  return response.data;
};

export default {
  ...apiClient,
  getByBusinessId,
};
