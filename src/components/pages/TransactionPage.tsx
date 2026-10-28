
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Search,
  Plus,
  ArrowLeft,
  ReceiptText,
  TrendingUp,
  LoaderCircle,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useCashbooks from "@/hooks/useCashbooks";
import useTransactions from "@/hooks/useTransactions";
import TransactionForm from "./TransactionForm";
import CashbookMembers from "./CashbookMembers";

const TransactionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);

  const businessId = searchParams.get("businessId") ?? undefined;
  const cashbookIdParam = searchParams.get("cashbookId");

  const activeCashbookId =
    cashbookIdParam &&
    Number.isSafeInteger(Number(cashbookIdParam)) &&
    Number(cashbookIdParam) > 0
      ? Number(cashbookIdParam)
      : null;

  const {
    cashbooks,
    isLoading: isCashbooksLoading,
    errorMessage: cashbooksError,
  } = useCashbooks(businessId);

  const {
    transactions,
    isLoading: isTransactionsLoading,
    errorMessage: transactionsError,
  } = useTransactions(activeCashbookId);

  const activeCashbook = cashbooks.find(
    (cashbook) => Number(cashbook.id) === activeCashbookId,
  );

  // Calculate balances using all fetched transactions, before filtering.
  const transactionsWithBalance = useMemo(() => {
    const chronologicalTransactions = [...transactions].sort(
      (a, b) => {
        const dateDifference =
          new Date(a.transactionDate).getTime() -
          new Date(b.transactionDate).getTime();

        return dateDifference || Number(a.id) - Number(b.id);
      },
    );

    let balance = 0;
    const balances = new Map<number, number>();

    chronologicalTransactions.forEach((transaction) => {
      const amount = Number(transaction.amount || 0);

      balance +=
        transaction.type === "CASH_IN" ? amount : -amount;

      balances.set(Number(transaction.id), balance);
    });

    return transactions.map((transaction) => ({
      ...transaction,
      balance: balances.get(Number(transaction.id)) ?? 0,
    }));
  }, [transactions]);

  const scopedTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactionsWithBalance.filter((transaction) => {
      const matchesSearch =
        !normalizedSearch ||
        transaction.remarks?.toLowerCase().includes(normalizedSearch) ||
        transaction.transactionNumber
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesType =
        typeFilter === "ALL" || transaction.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactionsWithBalance, search, typeFilter]);

  const totalIncome = scopedTransactions
    .filter((transaction) => transaction.type === "CASH_IN")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  const totalExpenses = scopedTransactions
    .filter((transaction) => transaction.type === "CASH_OUT")
    .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  const netMovement = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) =>
    `KSh ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const selectCashbook = (cashbookId: number | string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("cashbookId", String(cashbookId));
    setSearchParams(nextParams);
  };

  const changeCashbook = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("cashbookId");
    setSearchParams(nextParams);
  };

  if (!businessId) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h1 className="text-xl font-semibold text-slate-900">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            No business was provided. Open this page by selecting a cashbook
            from the Cashbooks page.
          </p>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (isCashbooksLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Loading cashbooks...
      </div>
    );
  }

  if (cashbooksError) {
    return (
      <div className="m-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {cashbooksError}
      </div>
    );
  }

  if (!activeCashbookId || !activeCashbook) {
    return (
      <div className="mx-auto w-full max-w-[1440px] space-y-6 p-6">
        <div>
          <p className="text-sm font-medium text-indigo-600">CASHBOOK</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Select a cashbook to view its transactions.
          </p>
        </div>

        {cashbooks.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <Wallet className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-3 font-semibold text-slate-800">
              No cashbooks available
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create a cashbook for this business first.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cashbooks.map((cashbook) => (
              <button
                key={cashbook.id}
                type="button"
                onClick={() => selectCashbook(cashbook.id)}
                className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Wallet className="h-5 w-5" />
                  </span>
                  <ArrowLeft className="h-4 w-4 rotate-180 text-slate-400 transition group-hover:text-indigo-600" />
                </div>
                <h2 className="mt-4 font-semibold text-slate-900">
                  {cashbook.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {cashbook.description || "View and manage transactions"}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isTransactionsLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Loading transactions...
      </div>
    );
  }

  if (transactionsError) {
    return (
      <div className="m-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {transactionsError}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 pb-10">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={changeCashbook}
            aria-label="Change cashbook"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <p className="text-sm font-medium text-indigo-600">
              CASHBOOK TRANSACTIONS
            </p>
            <h1 className="mt-1 truncate text-2xl font-semibold text-slate-900">
              {activeCashbook.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeCashbook.description || "Manage income and expenses"}
            </p>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Share cashbook */}
          <Dialog
            open={membersDialogOpen}
            onOpenChange={setMembersDialogOpen}
          >
            <button
              type="button"
              onClick={() => setMembersDialogOpen(true)}
              aria-label="Manage cashbook members"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Users className="h-4 w-4" />
              Share
            </button>

            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Share cashbook</DialogTitle>
                <DialogDescription>
                  Manage who can access {activeCashbook.name}.
                  Editors can work with transactions, while viewers have
                  read-only access.
                </DialogDescription>
              </DialogHeader>

              <CashbookMembers cashbookId={activeCashbookId} />
            </DialogContent>
          </Dialog>

          {/* Record transaction */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Record transaction
            </button>

            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Record transaction</DialogTitle>
                <DialogDescription>
                  Add an income or expense to {activeCashbook.name}.
                </DialogDescription>
              </DialogHeader>

              <TransactionForm
                cashbookId={activeCashbookId}
                onSuccess={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Money in
              </p>
              <p className="mt-2 truncate text-lg font-semibold text-emerald-700 sm:text-xl lg:text-2xl">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 sm:h-10 sm:w-10">
              <ArrowDownLeft className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Total income</p>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Money out
              </p>
              <p className="mt-2 truncate text-lg font-semibold text-rose-700 sm:text-xl lg:text-2xl">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 sm:h-10 sm:w-10">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Total expenses</p>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Net movement
              </p>
              <p
                className={`mt-2 truncate text-lg font-semibold sm:text-xl lg:text-2xl ${
                  netMovement >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {formatCurrency(netMovement)}
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Income minus expenses
          </p>
        </div>
      </section>

      {/* Search and filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by transaction number or remarks..."
              aria-label="Search transactions"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter transaction type"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="ALL">All transactions</option>
              <option value="CASH_IN">Cash in</option>
              <option value="CASH_OUT">Cash out</option>
            </select>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
              {scopedTransactions.length} transactions
            </span>
          </div>
        </div>
      </section>

      {/* Transactions table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-indigo-600" />
            <h2 className="font-semibold text-slate-900">
              Transaction history
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {scopedTransactions.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-600">
                  Date
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-600">
                  Transaction No.
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-slate-600">
                  Type
                </th>
                <th className="px-5 py-3 font-medium text-slate-600">
                  Remarks
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-600">
                  Amount
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-slate-600">
                  Balance
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {scopedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <ReceiptText className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No transactions found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                scopedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {transaction.transactionDate
                        ? new Date(
                            transaction.transactionDate,
                          ).toLocaleDateString("en-KE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                      {transaction.transactionNumber || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={
                          transaction.type === "CASH_IN"
                            ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                            : "inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700"
                        }
                      >
                        {transaction.type === "CASH_IN" ? (
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        )}
                        {transaction.type === "CASH_IN" ? "Cash in" : "Cash out"}
                      </span>
                    </td>

                    <td className="min-w-48 px-5 py-4 text-slate-600">
                      {transaction.remarks || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-slate-800">
                      {formatCurrency(Number(transaction.amount || 0))}
                    </td>

                    <td
                      className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${
                        transaction.balance >= 0
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {formatCurrency(transaction.balance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TransactionPage;
