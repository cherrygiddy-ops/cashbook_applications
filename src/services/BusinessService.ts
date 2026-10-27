import type { BusinessRequestDto } from "@/entities/BusinessRequestDto";
import type { BusinessResponseDto } from "@/entities/BusinessResponseDto";
import APICLIENT from "./ApiClient";

export default new APICLIENT<BusinessRequestDto, BusinessResponseDto>(
  "/api/businesses",
);