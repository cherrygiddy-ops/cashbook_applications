import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CreditCard,
  Download,
  LoaderCircle,
  Search,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useTransactions from "@/hooks/useTransactions";
import useCashbooks from "@/hooks/useCashbooks";
import TransactionForm from "./TransactionForm";

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);

export default function TransactionPage() {
  const { transactions, errorMessage, isError, isLoading } = useTransactions();
  const { cashbooks } = useCashbooks();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCashbookId = Number(searchParams.get("cashbookId"));
  const activeCashbookId = Number.isInteger(requestedCashbookId) && requestedCashbookId > 0
    ? requestedCashbookId
    : null;
  const activeCashbook = cashbooks.find((cashbook) => cashbook.id === activeCashbookId);
  const scopedTransactions = activeCashbookId
    ? transactions.filter((transaction) => transaction.cashbookId === activeCashbookId)
    : transactions;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [dialogOpen, setDialogOpen] = useState(
    () => searchParams.get("new") === "1",
  );

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    const nextSearchParams = new URLSearchParams(searchParams);
    if (open) {
      nextSearchParams.set("new", "1");
    } else {
      nextSearchParams.delete("new");
    }
    setSearchParams(nextSearchParams, { replace: true });
  };

  const now = new Date();
  const monthTransactions = scopedTransactions.filter((transaction) => {
    const date = new Date(`${transaction.transactionDate}T00:00:00`);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
  const sumByType = (records: typeof transactions, type: "CASH_IN" | "CASH_OUT") =>
    records.filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  const summary = [
    {
      label: "Money in",
      amount: formatAmount(sumByType(monthTransactions, "CASH_IN")),
      detail: `${monthTransactions.filter((transaction) => transaction.type === "CASH_IN").length} transactions this month`,
      icon: ArrowDownLeft,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Money out",
      amount: formatAmount(sumByType(monthTransactions, "CASH_OUT")),
      detail: `${monthTransactions.filter((transaction) => transaction.type === "CASH_OUT").length} transactions this month`,
      icon: ArrowUpRight,
      tone: "text-rose-700 bg-rose-50",
    },
    {
      label: "Net movement",
      amount: `${sumByType(scopedTransactions, "CASH_IN") - sumByType(scopedTransactions, "CASH_OUT") < 0 ? "−" : "+"}${formatAmount(Math.abs(sumByType(scopedTransactions, "CASH_IN") - sumByType(scopedTransactions, "CASH_OUT")))}`,
      detail: activeCashbook ? `In ${activeCashbook.name}` : "Across fetched transactions",
      icon: ArrowDownUp,
      tone: "text-sky-700 bg-sky-50",
    },
  ];
  const visibleTransactions = scopedTransactions.filter((transaction) => {
    const matchesType = filter === "ALL" || transaction.type === filter;
    const searchText = `${transaction.transactionNumber} ${transaction.remarks ?? ""} ${transaction.createdBy} ${transaction.paymentMode}`.toLowerCase();
    return matchesType && searchText.includes(query.trim().toLowerCase());
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Cashbook / Activity
          </p>
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            {activeCashbook ? `${activeCashbook.name} transactions` : "Transactions"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {activeCashbook ? `All activity recorded in ${activeCashbook.name}.` : "A clear view of every shilling moving through your cashbooks."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <span className="text-lg leading-none">+</span>
                New transaction
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record a transaction</DialogTitle>
                <DialogDescription>
                  {activeCashbook ? `Add an income or expense to ${activeCashbook.name}.` : "Add an income or expense to your main cashbook."}
                </DialogDescription>
              </DialogHeader>
              <TransactionForm
                cashbookId={activeCashbookId ?? 1}
                onSuccess={() => handleDialogOpenChange(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex min-h-28 items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:rounded-md sm:border sm:shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  {item.amount}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              </div>
              <span className={`rounded-md p-2.5 ${item.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Recent activity
              </h2>
              {isLoading && <LoaderCircle className="h-4 w-4 animate-spin text-slate-400" aria-label="Loading transactions" />}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Your latest cashbook entries
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search transactions"
                aria-label="Search transactions"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Filter transaction type</span>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-40"
              >
                <option value="ALL">All activity</option>
                <option value="CASH_IN">Money in</option>
                <option value="CASH_OUT">Money out</option>
              </select>
              <ArrowDownUp className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-500 sm:px-5">
          <CalendarDays className="h-4 w-4" />
              <span>Transaction history · {scopedTransactions.length} records loaded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Transaction</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Recorded by</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Type</th>
                <th className="whitespace-nowrap bg-slate-50/70 px-5 py-3 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isError && (
                <tr>
                  <td colSpan={7} role="alert" className="px-5 py-10 text-center text-sm text-rose-700">
                    {errorMessage || "Unable to load transactions."}
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                    <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />
                    Loading transactions...
                  </td>
                </tr>
              )}
              {visibleTransactions.map((transaction) => {
                const isIncome = transaction.type === "CASH_IN";
                const date = new Date(`${transaction.transactionDate}T00:00:00`);
                const createdAt = new Date(transaction.createdAt);
                const paymentLabels = { CASH: "Cash", MPESA: "M-Pesa", BANK: "Bank transfer", CARD: "Card" };
                return (
                  <tr key={transaction.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                            isIncome ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-800">
                            {transaction.remarks || transaction.transactionNumber}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {transaction.contactId ? `Contact #${transaction.contactId}` : "No contact"} · {transaction.categoryId ? `Category #${transaction.categoryId}` : "Uncategorized"}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                      {transaction.createdBy}
                    </td>
                    <td className="px-4 py-4">
                      <span className="block whitespace-nowrap text-sm text-slate-700">
                        {new Intl.DateTimeFormat("en-KE", { dateStyle: "medium" }).format(date)}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {Number.isNaN(createdAt.getTime()) ? "" : new Intl.DateTimeFormat("en-KE", { hour: "numeric", minute: "2-digit" }).format(createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                        {transaction.paymentMode === "CASH" ? (
                          <Banknote className="h-4 w-4 text-slate-400" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-slate-400" />
                        )}
                        {paymentLabels[transaction.paymentMode]}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-4 text-right text-sm font-semibold tabular-nums ${
                        isIncome ? "text-emerald-700" : "text-slate-800"
                      }`}
                    >
                      {isIncome ? "+" : "−"}
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {isIncome ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap bg-slate-50/40 px-5 py-4 text-right text-sm font-semibold tabular-nums text-slate-800">
                      {formatAmount(transaction.runningBalance)}
                    </td>
                  </tr>
                );
              })}
              {!isLoading && !isError && visibleTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Wallet className="mx-auto h-6 w-6 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No matching transactions
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or activity filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {visibleTransactions.length} of {scopedTransactions.length} transactions
          </span>
          <span>Latest running balance: <strong className="font-semibold text-slate-700">{scopedTransactions[0] ? formatAmount(scopedTransactions[0].runningBalance) : "—"}</strong></span>
        </div>
      </section>
    </div>
  );
}

