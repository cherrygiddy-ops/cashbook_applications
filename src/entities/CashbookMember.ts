
export type CashbookMemberRole = "EDITOR" | "VIEWER";

export interface ShareCashbookRequest {
  phoneNumber: string;
  memberRole: CashbookMemberRole;
}

export interface UpdateCashbookMemberRoleRequest {
  memberRole: CashbookMemberRole;
}

export interface CashbookMemberResponse {
  id: number;
  userId: number;
  username: string;
  phoneNumber: string;
  memberRole: CashbookMemberRole;
  createdAt: string;
}
