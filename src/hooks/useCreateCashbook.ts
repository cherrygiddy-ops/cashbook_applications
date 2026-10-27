import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { CashbookRequestDto } from "@/entities/CashbookRequestDto";
import type { CashbookResponseDto } from "@/entities/CashbookResponseDto";
import type { ApiErrorResponse } from "@/hooks/useTransaction";
import CashbookService from "@/services/CashbookService";

const useCreateCashbook = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CashbookResponseDto,
    AxiosError<ApiErrorResponse>,
    CashbookRequestDto
  >({
    mutationFn: (payload) => CashbookService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cashbooks"] });
    },
  });

  const errorMessage =
    mutation.error?.response?.data?.message ||
    mutation.error?.response?.data?.details ||
    mutation.error?.response?.data?.error ||
    mutation.error?.message ||
    null;

  return {
    createCashbook: mutation.mutateAsync,
    errorMessage,
    isPending: mutation.isPending,
    reset: mutation.reset,
  };
};

export default useCreateCashbook;