
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Trash2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import {
  useCashbookMembers,
  useShareCashbook,
  useUpdateCashbookMemberRole,
  useRemoveCashbookMember,
  type CashbookMemberApiError,
} from "@/hooks/useCashbookMembers";

import type {
  CashbookMemberRole,
  CashbookMemberResponse,
} from "@/entities/CashbookMember";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CashbookMembersProps {
  cashbookId: number;
}

const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return (
      data?.message ??
      data?.error ??
      error.message ??
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
};

export default function CashbookMembers({
  cashbookId,
}: CashbookMembersProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [memberRole, setMemberRole] =
    useState<CashbookMemberRole>("EDITOR");

  const {
    data: members = [],
    isPending,
    isError,
    error,
  } = useCashbookMembers(cashbookId);

  const shareMutation = useShareCashbook(cashbookId);
  const updateRoleMutation =
    useUpdateCashbookMemberRole(cashbookId);
  const removeMutation = useRemoveCashbookMember(cashbookId);

  const handleShare = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPhone = phoneNumber.trim();

    if (!trimmedPhone) {
      toast.error("Enter the user's phone number.");
      return;
    }

    shareMutation.mutate(
      {
        phoneNumber: trimmedPhone,
        memberRole,
      },
      {
        onSuccess: () => {
          toast.success("Cashbook shared successfully.");
          setPhoneNumber("");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err));
        },
      }
    );
  };

  const handleRoleChange = (
    member: CashbookMemberResponse,
    newRole: CashbookMemberRole
  ) => {
    if (member.memberRole === newRole) return;

    updateRoleMutation.mutate(
      {
        userId: member.userId,
        request: { memberRole: newRole },
      },
      {
        onSuccess: () => {
          toast.success("Member role updated.");
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err));
        },
      }
    );
  };

  const handleRemove = (member: CashbookMemberResponse) => {
    const confirmed = window.confirm(
      `Remove ${member.username}'s access to this cashbook?`
    );

    if (!confirmed) return;

    removeMutation.mutate(member.userId, {
      onSuccess: () => {
        toast.success("Cashbook access removed.");
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err));
      },
    });
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <Users className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Cashbook members
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage who can access this cashbook.
          </p>
        </div>
      </div>

      {/* Share form */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <UserPlus className="h-4 w-4" />
          Share cashbook
        </h3>

        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-phone">
              User's phone number
            </Label>
            <Input
              id="member-phone"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(event.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">Permission</Label>
            <select
              id="member-role"
              value={memberRole}
              onChange={(event) =>
                setMemberRole(
                  event.target.value as CashbookMemberRole
                )
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="EDITOR">
                Editor — can work with transactions
              </option>
              <option value="VIEWER">
                Viewer — read-only access
              </option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={shareMutation.isPending}
            className="w-full sm:w-auto"
          >
            {shareMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Share cashbook
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Members list */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h3 className="font-semibold">People with access</h3>
            <p className="text-sm text-muted-foreground">
              {members.length} shared{" "}
              {members.length === 1 ? "member" : "members"}
            </p>
          </div>

          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="divide-y">
          {isPending && (
            <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading members...
            </div>
          )}

          {isError && (
            <div className="p-5 text-sm text-destructive">
              {getApiErrorMessage(error)}
            </div>
          )}

          {!isPending && !isError && members.length === 0 && (
            <div className="p-8 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No shared members yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Share this cashbook with a registered user to get started.
              </p>
            </div>
          )}

          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {member.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.phoneNumber}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Added{" "}
                  {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label={`Permission for ${member.username}`}
                  value={member.memberRole}
                  disabled={updateRoleMutation.isPending}
                  onChange={(event) =>
                    handleRoleChange(
                      member,
                      event.target.value as CashbookMemberRole
                    )
                  }
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                </select>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={removeMutation.isPending}
                  onClick={() => handleRemove(member)}
                  aria-label={`Remove ${member.username}`}
                  title="Remove access"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
