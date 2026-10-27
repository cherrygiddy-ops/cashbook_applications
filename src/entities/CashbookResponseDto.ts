export interface CashbookResponseDto {
  id: number;
  name: string;
  description: string | null;
  businessId: number;
  ownerId?: number | null;
  createdAt: string;
  updatedAt: string;
}