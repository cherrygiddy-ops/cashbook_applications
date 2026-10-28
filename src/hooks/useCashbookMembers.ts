
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import CashbookMemberService from "@/services/CashbookMemberService";
import type {
  CashbookMemberResponse,
  ShareCashbookRequest,
  UpdateCashbookMemberRoleRequest,
} from "@/entities/CashbookMember";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export type CashbookMemberApiError = AxiosError<ApiErrorResponse>;

export const cashbookMemberKeys = {
  all: ["cashbookMembers"] as const,
  byCashbook: (cashbookId: number) =>
    [...cashbookMemberKeys.all, cashbookId] as const,
};

// Fetch members who have access to a specific cashbook.
export const useCashbookMembers = (cashbookId: number) => {
  return useQuery<
    CashbookMemberResponse[],
    CashbookMemberApiError
  >({
    queryKey: cashbookMemberKeys.byCashbook(cashbookId),
    queryFn: () => CashbookMemberService.getMembers(cashbookId),
    enabled: Number.isInteger(cashbookId) && cashbookId > 0,
  });
};

// Share a cashbook with a registered user.
export const useShareCashbook = (cashbookId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    CashbookMemberResponse,
    CashbookMemberApiError,
    ShareCashbookRequest
  >({
    mutationFn: (request) =>
      CashbookMemberService.shareCashbook(cashbookId, request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cashbookMemberKeys.byCashbook(cashbookId),
      });
    },
  });
};

// Change a shared user's role.
export interface UpdateMemberRoleVariables {
  userId: number;
  request: UpdateCashbookMemberRoleRequest;
}

export const useUpdateCashbookMemberRole = (cashbookId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    CashbookMemberResponse,
    CashbookMemberApiError,
    UpdateMemberRoleVariables
  >({
    mutationFn: ({ userId, request }) =>
      CashbookMemberService.updateMemberRole(
        cashbookId,
        userId,
        request
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cashbookMemberKeys.byCashbook(cashbookId),
      });
    },
  });
};

// Remove a user's access to a cashbook.
export const useRemoveCashbookMember = (cashbookId: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    CashbookMemberApiError,
    number
  >({
    mutationFn: (userId) =>
      CashbookMemberService.removeMember(cashbookId, userId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cashbookMemberKeys.byCashbook(cashbookId),
      });
    },
  });
};
