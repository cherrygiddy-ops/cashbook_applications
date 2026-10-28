import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import TransactionService from "@/services/TransactionService";
import { TransactionResponseDto } from "@/entities/TransactionResponseDto";
import { TransactionRequestDto } from "@/entities/TransactionRequestDto";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string;
}

const useTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    TransactionResponseDto,
    AxiosError<ApiErrorResponse>,
    TransactionRequestDto
  >({
    mutationFn: (payload) => TransactionService.create(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["cashbooks"],
        }),
      ]);
    },
  });

  const errorMessage =
    mutation.error?.response?.data?.message ||
    mutation.error?.response?.data?.details ||
    mutation.error?.response?.data?.error ||
    mutation.error?.message ||
    null;

  return {
    createTransaction: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error,
    errorMessage,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export default useTransaction;