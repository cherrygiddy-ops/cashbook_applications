import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { BusinessResponseDto } from "@/entities/BusinessResponseDto";
import type { ApiErrorResponse } from "@/hooks/useTransaction";
import BusinessService from "@/services/BusinessService";

const useBusinesses = () => {
  const query = useQuery<
    BusinessResponseDto[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["businesses"],
    queryFn: async () => {
      const businesses = await BusinessService.getAll();
      return businesses.sort(
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
    businesses: query.data ?? [],
    errorMessage,
    isError: query.isError,
    isLoading: query.isLoading,
  };
};

export default useBusinesses;