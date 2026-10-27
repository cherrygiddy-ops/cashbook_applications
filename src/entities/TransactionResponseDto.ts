import type PaymentMode from "./PaymentMode";
import type TransactionType from "./TransactionType";
export interface TransactionResponseDto {
  id: number;
  transactionNumber: string;
  transactionDate: string;
  type: TransactionType;
  amount: number;
  runningBalance: number;
  remarks: string | null;
  paymentMode: PaymentMode;
  cashbookId: number;
  categoryId: number | null;
  contactId: number | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}