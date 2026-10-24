
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { CashbookResponseDto } from "@/entities/CashbookResponseDto";
import type { ApiErrorResponse } from "@/hooks/useTransaction";
import CashbookService from "@/services/CashbookService";

const useCashbooks = (businessId: number | string | undefined) => {
  const query = useQuery<
    CashbookResponseDto[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["cashbooks", businessId],
    queryFn: async () => {
      const cashbooks =
        await CashbookService.getByBusinessId(businessId!);

      return cashbooks.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      );
    },
    enabled: businessId !== undefined && businessId !== null,
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
