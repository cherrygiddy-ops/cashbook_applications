
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  ReceiptText,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/Store/AuthStore";

const summaryCards = [
  {
    title: "Total Income",
    amount: "KSh 0.00",
    description: "Income recorded",
    icon: ArrowDownLeft,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Total Expenses",
    amount: "KSh 0.00",
    description: "Expenses recorded",
    icon: ArrowUpRight,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "Cashbook Balance",
    amount: "KSh 0.00",
    description: "Current balance",
    icon: Wallet,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Transactions",
    amount: "0",
    description: "Recorded transactions",
    icon: ReceiptText,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const displayName =
    user?.username ||
    "User";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back, {displayName}. Here is your financial overview.
          </p>
        </div>

        <Link
          to="/transactions?new=1"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          New transaction
        </Link>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                    {card.amount}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {card.description}
                  </p>
                </div>

                <div className={`rounded-lg p-3 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main dashboard content */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent transactions */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest income and expenses
              </p>
            </div>

            <Link
              to="/transactions?new=1"
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="rounded-full bg-slate-100 p-4">
              <ReceiptText className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-4 font-medium text-slate-900">
              No transactions yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Your recorded income and expenses will appear here.
            </p>

            <Link
              to="/transactions?new=1"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Record transaction
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your finances
          </p>

          <div className="mt-5 space-y-3">
            <Link
              to="/transactions"
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
            >
              <div className="rounded-lg bg-emerald-50 p-2">
                <Plus className="h-4 w-4 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  Add transaction
                </p>
                <p className="text-xs text-slate-500">
                  Record income or expenses
                </p>
              </div>
            </Link>

            <Link
              to="/cashbooks"
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
            >
              <div className="rounded-lg bg-blue-50 p-2">
                <Wallet className="h-4 w-4 text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  Manage cashbooks
                </p>
                <p className="text-xs text-slate-500">
                  View your cashbooks
                </p>
              </div>
            </Link>

            <Link
              to="/reports"
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
            >
              <div className="rounded-lg bg-violet-50 p-2">
                <Clock className="h-4 w-4 text-violet-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  View reports
                </p>
                <p className="text-xs text-slate-500">
                  Review financial activity
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
