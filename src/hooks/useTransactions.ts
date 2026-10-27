import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { TransactionResponseDto } from "@/entities/TransactionResponseDto";
import type { ApiErrorResponse } from "@/hooks/useTransaction";
import { useAuthStore } from "@/Store/AuthStore";
import TransactionService from "@/services/TransactionService";

const useTransactions = () => {
  const user = useAuthStore((state) => state.user);
  const currentUserIdentity = [user?.username, user?.email]
    .filter(Boolean)
    .map((identity) => identity!.trim().toLowerCase());

  const query = useQuery<
    TransactionResponseDto[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["transactions", user?.username, user?.email],
    enabled: currentUserIdentity.length > 0,
    queryFn: async () => {
      const transactions = await TransactionService.getAll();
      return transactions
        .filter((transaction) => {
          const creator = transaction.createdBy?.trim().toLowerCase();
          return creator ? currentUserIdentity.includes(creator) : false;
        })
        .sort((left, right) => {
        const dateDifference =
          new Date(right.transactionDate).getTime() -
          new Date(left.transactionDate).getTime();
        return dateDifference ||
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
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