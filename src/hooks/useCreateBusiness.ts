import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { BusinessRequestDto } from "@/entities/BusinessRequestDto";
import type { BusinessResponseDto } from "@/entities/BusinessResponseDto";
import type { ApiErrorResponse } from "@/hooks/useTransaction";
import BusinessService from "@/services/BusinessService";

const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    BusinessResponseDto,
    AxiosError<ApiErrorResponse>,
    BusinessRequestDto
  >({
    mutationFn: (payload) => BusinessService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });

  const errorMessage =
    mutation.error?.response?.data?.message ||
    mutation.error?.response?.data?.details ||
    mutation.error?.response?.data?.error ||
    mutation.error?.message ||
    null;

  return {
    createBusiness: mutation.mutateAsync,
    errorMessage,
    isPending: mutation.isPending,
    reset: mutation.reset,
  };
};

export default useCreateBusiness;