
import { TransactionResponseDto } from "@/entities/TransactionResponseDto";
import { TransactionRequestDto } from "@/entities/TransactionRequestDto";
import APICLIENT, { axiosInstance } from "./ApiClient";

const transactionClient = new APICLIENT<
  TransactionRequestDto,
  TransactionResponseDto
>("/api/transactions");

const TransactionService = {
  ...transactionClient,

  async getByCashbook(
    cashbookId: number
  ): Promise<TransactionResponseDto[]> {
    const response = await axiosInstance.get<TransactionResponseDto[]>(
      `/api/transactions/cashbook/${cashbookId}`
    );

    return response.data;
  },
};

export default TransactionService;
