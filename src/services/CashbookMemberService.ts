
import type {
  CashbookMemberResponse,
  ShareCashbookRequest,
  UpdateCashbookMemberRoleRequest,
} from "@/entities/CashbookMember";
import APICLIENT, { axiosInstance } from "./ApiClient";

const baseClient = new APICLIENT<
  ShareCashbookRequest,
  CashbookMemberResponse
>("/cashbooks");

const CashbookMemberService = {
  getMembers: (cashbookId: number) =>
    axiosInstance
      .get<CashbookMemberResponse[]>(
        `api/cashbooks/${cashbookId}/members`
      )
      .then((res) => res.data),

  shareCashbook: (cashbookId: number, request: ShareCashbookRequest) =>
    axiosInstance
      .post<CashbookMemberResponse>(
        `api/cashbooks/${cashbookId}/members`,
        request
      )
      .then((res) => res.data),

  updateMemberRole: (
    cashbookId: number,
    userId: number,
    request: UpdateCashbookMemberRoleRequest
  ) =>
    axiosInstance
      .patch<CashbookMemberResponse>(
        `/cashbooks/${cashbookId}/members/${userId}`,
        request
      )
      .then((res) => res.data),

  removeMember: (cashbookId: number, userId: number) =>
    axiosInstance
      .delete(`api/cashbooks/${cashbookId}/members/${userId}`)
      .then((res) => res.data),
};

export default CashbookMemberService;
