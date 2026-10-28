import type PaymentMode from "./PaymentMode";
import type TransactionType from "./TransactionType";
export interface TransactionRequestDto {
  transactionDate: string; // LocalDate: YYYY-MM-DD
  type: TransactionType;
  amount: number;
  remarks?: string;
  paymentMode: PaymentMode
  cashbookId: number;
  categoryId?: number | null;
  contactId?: number | null;
}