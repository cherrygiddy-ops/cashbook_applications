export interface BusinessResponseDto {
  id: number;
  businessName: string;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}