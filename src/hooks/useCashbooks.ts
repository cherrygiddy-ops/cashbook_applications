import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { CashbookResponseDto } from "@/entities/CashbookResponseDto";
import type { ApiErrorResponse } from "@/hooks/useTransaction";
import CashbookService from "@/services/CashbookService";

const useCashbooks = () => {
  const query = useQuery<
    CashbookResponseDto[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["cashbooks"],
    queryFn: async () => {
      const cashbooks = await CashbookService.getAll();
      return cashbooks.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      );
    },
  });

  const errorMessage =
    query.error?.response?.data?.message ||
    query.error?.response?.data?.details ||
    query.error?.response?.data?.error ||
    query.error?.message ||
    null;

  return {
    cashbooks: query.data ?? [],
    errorMessage,
    isError: query.isError,
    isLoading: query.isLoading,
  };
};

export default useCashbooks;