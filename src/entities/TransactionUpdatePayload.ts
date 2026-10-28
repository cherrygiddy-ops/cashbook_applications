import type TransactionType from "./TransactionType";
import type PaymentMode from "./PaymentMode";

interface TransactionUpdatePayload {
  type?: TransactionType;
  amount?: number;
  remarks?: string;
  paymentMode?: PaymentMode;
  categoryId?: number;
  contactId?: number;
  transactionDate?: string;
}

export default TransactionUpdatePayload;