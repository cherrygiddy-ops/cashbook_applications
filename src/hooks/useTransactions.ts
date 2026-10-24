
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { TransactionResponseDto } from "@/entities/TransactionResponseDto";
import type { ApiErrorResponse } from "@/hooks/useTransaction";
import TransactionService from "@/services/TransactionService";

const useTransactions = (cashbookId?: number | null) => {
  const validCashbookId =
    typeof cashbookId === "number" &&
    Number.isInteger(cashbookId) &&
    cashbookId > 0
      ? cashbookId
      : undefined;

  const query = useQuery<
    TransactionResponseDto[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["transactions", validCashbookId ?? "all"],
    queryFn: async () => {
      const transactions = validCashbookId
        ? await TransactionService.getByCashbook(validCashbookId)
        : await TransactionService.getAll();

      return [...transactions].sort((left, right) => {
        const dateDifference =
          new Date(right.transactionDate).getTime() -
          new Date(left.transactionDate).getTime();

        return (
          dateDifference ||
          new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime()
        );
      });
    },
  });

  const errorMessage =
    query.error?.response?.data?.message ||
    query.error?.response?.data?.details ||
    query.error?.response?.data?.error ||
    query.error?.message ||
    null;

  return {
    transactions: query.data ?? [],
    errorMessage,
    isError: query.isError,
    isLoading: query.isLoading,
  };
};

export default useTransactions;
