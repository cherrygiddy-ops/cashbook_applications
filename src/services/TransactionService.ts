
import { TransactionResponseDto } from "@/entities/TransactionResponseDto";
import APICLIENT from "./ApiClient";
import { TransactionRequestDto } from "@/entities/TransactionRequestDto";

export default new APICLIENT<TransactionRequestDto, TransactionResponseDto>(
  "/api/transactions"
);
