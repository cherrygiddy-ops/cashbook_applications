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
import TransactionForm from "./TransactionForm";

type TransactionKind = "CASH_IN" | "CASH_OUT";

interface Transaction {
  id: string;
  title: string;
  category: string;
  contact: string;
  recordedBy: string;
  date: string;
  time: string;
  payment: string;
  amount: number;
  type: TransactionKind;
}

const transactions: Transaction[] = [
  {
    id: "CB-2408",
    title: "August sales",
    category: "Sales revenue",
    contact: "Walk-in customers",
    recordedBy: "Grace Njeri",
    date: "28 Aug 2026",
    time: "10:42 AM",
    payment: "M-Pesa",
    amount: 48500,
    type: "CASH_IN",
  },
  {
    id: "CB-2407",
    title: "Shop rent",
    category: "Rent & utilities",
    contact: "Kilimani Properties",
    recordedBy: "Peter Kamau",
    date: "27 Aug 2026",
    time: "3:18 PM",
    payment: "Bank transfer",
    amount: 28000,
    type: "CASH_OUT",
  },
  {
    id: "CB-2406",
    title: "Stock replenishment",
    category: "Inventory",
    contact: "Nairobi Wholesale Ltd",
    recordedBy: "Grace Njeri",
    date: "26 Aug 2026",
    time: "11:06 AM",
    payment: "M-Pesa",
    amount: 16400,
    type: "CASH_OUT",
  },
  {
    id: "CB-2405",
    title: "Consulting payment",
    category: "Services",
    contact: "Amina Wanjiku",
    recordedBy: "David Otieno",
    date: "25 Aug 2026",
    time: "9:30 AM",
    payment: "Bank transfer",
    amount: 32000,
    type: "CASH_IN",
  },
  {
    id: "CB-2404",
    title: "Internet & phone",
    category: "Rent & utilities",
    contact: "Safaricom PLC",
    recordedBy: "Peter Kamau",
    date: "23 Aug 2026",
    time: "4:51 PM",
    payment: "M-Pesa",
    amount: 4500,
    type: "CASH_OUT",
  },
  {
    id: "CB-2403",
    title: "Weekend market sales",
    category: "Sales revenue",
    contact: "Walk-in customers",
    recordedBy: "Grace Njeri",
    date: "22 Aug 2026",
    time: "6:12 PM",
    payment: "Cash",
    amount: 18750,
    type: "CASH_IN",
  },
  {
    id: "CB-2402",
    title: "Packaging supplies",
    category: "Supplies",
    contact: "PackPro Kenya",
    recordedBy: "David Otieno",
    date: "21 Aug 2026",
    time: "1:24 PM",
    payment: "Card",
    amount: 6200,
    type: "CASH_OUT",
  },
  {
    id: "CB-2401",
    title: "Project deposit",
    category: "Services",
    contact: "J. Mwangi",
    recordedBy: "Peter Kamau",
    date: "20 Aug 2026",
    time: "8:55 AM",
    payment: "Bank transfer",
    amount: 55000,
    type: "CASH_IN",
  },
];

const openingBalance = 329500;
const balanceByTransactionId = [...transactions]
  .reverse()
  .reduce<{ balance: number; byId: Record<string, number> }>(
    (running, transaction) => {
      const balance =
        running.balance +
        (transaction.type === "CASH_IN" ? transaction.amount : -transaction.amount);
      return {
        balance,
        byId: { ...running.byId, [transaction.id]: balance },
      };
    },
    { balance: openingBalance, byId: {} },
  ).byId;

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);

const summary = [
  {
    label: "Money in",
    amount: "KSh 154,250",
    detail: "12 transactions this month",
    icon: ArrowDownLeft,
    tone: "text-emerald-700 bg-emerald-50",
  },
  {
    label: "Money out",
    amount: "KSh 55,100",
    detail: "8 transactions this month",
    icon: ArrowUpRight,
    tone: "text-rose-700 bg-rose-50",
  },
  {
    label: "Net movement",
    amount: "+KSh 99,150",
    detail: "Across all cashbooks",
    icon: ArrowDownUp,
    tone: "text-sky-700 bg-sky-50",
  },
];

export default function TransactionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const visibleTransactions = transactions.filter((transaction) => {
    const matchesType = filter === "ALL" || transaction.type === filter;
    const searchText = `${transaction.title} ${transaction.category} ${transaction.contact} ${transaction.id}`.toLowerCase();
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
            Transactions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A clear view of every shilling moving through your cashbooks.
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
                  Add an income or expense to your main cashbook.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm
                cashbookId={1}
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
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Sample data
              </span>
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
          <span>Running balance · Opening balance {formatAmount(openingBalance)} · 20–28 August 2026</span>
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
              {visibleTransactions.map((transaction) => {
                const isIncome = transaction.type === "CASH_IN";
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
                            {transaction.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {transaction.contact} · {transaction.category}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                      {transaction.recordedBy}
                    </td>
                    <td className="px-4 py-4">
                      <span className="block whitespace-nowrap text-sm text-slate-700">
                        {transaction.date}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {transaction.time}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                        {transaction.payment === "Cash" ? (
                          <Banknote className="h-4 w-4 text-slate-400" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-slate-400" />
                        )}
                        {transaction.payment}
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
                      {formatAmount(balanceByTransactionId[transaction.id])}
                    </td>
                  </tr>
                );
              })}
              {visibleTransactions.length === 0 && (
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
            Showing {visibleTransactions.length} of {transactions.length} sample transactions
          </span>
          <span>Cashbook balance: <strong className="font-semibold text-slate-700">KSh 428,650</strong></span>
        </div>
      </section>
    </div>
  );
}

