import type { CashbookRequestDto } from "@/entities/CashbookRequestDto";
import type { CashbookResponseDto } from "@/entities/CashbookResponseDto";
import APICLIENT from "./ApiClient";

export default new APICLIENT<CashbookRequestDto, CashbookResponseDto>(
  "/api/cashbooks",
);