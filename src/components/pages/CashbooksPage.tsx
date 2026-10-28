import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  CirclePlus,
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

type CashbookStatus = "Active" | "Archived";
type CashbookKind = "Business" | "Personal";

interface Cashbook {
  id: number;
  name: string;
  kind: CashbookKind;
  owner: string;
  balance: number;
  transactions: number;
  updated: string;
  status: CashbookStatus;
}

const initialCashbooks: Cashbook[] = [
  {
    id: 1,
    name: "Main business",
    kind: "Business",
    owner: "Grace Njeri",
    balance: 428650,
    transactions: 86,
    updated: "Today, 10:42 AM",
    status: "Active",
  },
  {
    id: 2,
    name: "Kilimani shop",
    kind: "Business",
    owner: "Peter Kamau",
    balance: 186300,
    transactions: 42,
    updated: "Today, 9:18 AM",
    status: "Active",
  },
  {
    id: 3,
    name: "Daily expenses",
    kind: "Personal",
    owner: "Grace Njeri",
    balance: 24750,
    transactions: 31,
    updated: "Yesterday, 5:26 PM",
    status: "Active",
  },
  {
    id: 4,
    name: "Market fund",
    kind: "Business",
    owner: "David Otieno",
    balance: 73400,
    transactions: 18,
    updated: "25 Aug 2026",
    status: "Active",
  },
  {
    id: 5,
    name: "Pop-up stall 2025",
    kind: "Business",
    owner: "Grace Njeri",
    balance: 0,
    transactions: 24,
    updated: "31 Dec 2025",
    status: "Archived",
  },
];

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);

export default function CashbooksPage() {
  const [cashbooks, setCashbooks] = useState(initialCashbooks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All cashbooks");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CashbookKind>("Business");

  const visibleCashbooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return cashbooks.filter((cashbook) => {
      const matchesQuery = `${cashbook.name} ${cashbook.kind} ${cashbook.owner}`
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "All cashbooks" || cashbook.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [cashbooks, query, statusFilter]);

  const activeCashbooks = cashbooks.filter((cashbook) => cashbook.status === "Active");
  const totalBalance = activeCashbooks.reduce((total, cashbook) => total + cashbook.balance, 0);

  const handleCreateCashbook = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    setCashbooks((current) => [
      {
        id: Math.max(0, ...current.map((cashbook) => cashbook.id)) + 1,
        name: cleanName,
        kind,
        owner: "You",
        balance: 0,
        transactions: 0,
        updated: "Just created",
        status: "Active",
      },
      ...current,
    ]);
    setName("");
    setKind("Business");
    setDialogOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Workspace / Accounts
          </p>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Cashbooks</h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep business and personal money organised in one place.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <CirclePlus className="h-4 w-4" />
              New cashbook
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create a cashbook</DialogTitle>
              <DialogDescription>
                Set up a separate ledger for a business or personal account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCashbook} className="space-y-4 pt-2">
              <div>
                <label htmlFor="cashbook-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Cashbook name
                </label>
                <input
                  id="cashbook-name"
                  autoFocus
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Downtown store"
                  className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label htmlFor="cashbook-kind" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Cashbook type
                </label>
                <select
                  id="cashbook-kind"
                  value={kind}
                  onChange={(event) => setKind(event.target.value as CashbookKind)}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Business</option>
                  <option>Personal</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Create cashbook
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex min-h-28 items-start justify-between rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Total active balance</p>
            <p className="mt-2 font-display text-2xl font-semibold text-slate-900">{formatAmount(totalBalance)}</p>
            <p className="mt-1 text-xs text-slate-500">Across active cashbooks</p>
          </div>
          <span className="rounded-md bg-emerald-50 p-2.5 text-emerald-700"><Wallet className="h-5 w-5" /></span>
        </div>
        <div className="flex min-h-28 items-start justify-between rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Active cashbooks</p>
            <p className="mt-2 font-display text-2xl font-semibold text-slate-900">{activeCashbooks.length}</p>
            <p className="mt-1 text-xs text-slate-500">Ready for new entries</p>
          </div>
          <span className="rounded-md bg-sky-50 p-2.5 text-sky-700"><BriefcaseBusiness className="h-5 w-5" /></span>
        </div>
        <div className="flex min-h-28 items-start justify-between rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Money movement</p>
            <p className="mt-2 font-display text-2xl font-semibold text-slate-900">+KSh 99,150</p>
            <p className="mt-1 text-xs text-slate-500">Net this month</p>
          </div>
          <span className="rounded-md bg-amber-50 p-2.5 text-amber-700"><ArrowDownRight className="h-5 w-5" /></span>
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">Your cashbooks</h2>
            <p className="mt-1 text-sm text-slate-500">Balances and recent activity by ledger</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search cashbooks"
                aria-label="Search cashbooks"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <label>
              <span className="sr-only">Filter cashbooks by status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-40"
              >
                <option>All cashbooks</option>
                <option>Active</option>
                <option>Archived</option>
              </select>
            </label>
          </div>
        </div>

        <div className="divide-y divide-slate-100 xl:hidden">
          {visibleCashbooks.map((cashbook) => (
            <article key={cashbook.id} className="space-y-3 px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${cashbook.kind === "Business" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>
                    {cashbook.kind === "Business" ? <BriefcaseBusiness className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800">{cashbook.name}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{cashbook.kind} · #{cashbook.id.toString().padStart(3, "0")}</span>
                  </span>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${cashbook.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{cashbook.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 pl-12 text-xs">
                <span className="text-slate-500">Balance</span>
                <span className="text-right font-semibold tabular-nums text-slate-800">{formatAmount(cashbook.balance)}</span>
                <span className="text-slate-500">Owner</span>
                <span className="truncate text-right text-slate-700">{cashbook.owner}</span>
                <span className="text-slate-500">Transactions</span>
                <span className="text-right tabular-nums text-slate-700">{cashbook.transactions}</span>
                <span className="text-slate-500">Last activity</span>
                <span className="truncate text-right text-slate-700">{cashbook.updated}</span>
              </div>
              <Link to="/transactions" className="ml-12 inline-flex h-8 items-center gap-2 rounded-md px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                Open cashbook <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
          {visibleCashbooks.length === 0 && (
            <div className="px-5 py-14 text-center">
              <Wallet className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">No cashbooks found</p>
              <p className="mt-1 text-sm text-slate-500">Try a different search or status filter.</p>
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Cashbook</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Transactions</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
                <th className="px-5 py-3 text-right font-medium">Status</th>
                <th className="px-5 py-3"><span className="sr-only">Open cashbook</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleCashbooks.map((cashbook) => (
                <tr key={cashbook.id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${cashbook.kind === "Business" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>
                        {cashbook.kind === "Business" ? <BriefcaseBusiness className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">{cashbook.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{cashbook.kind} · #{cashbook.id.toString().padStart(3, "0")}</span>
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{cashbook.owner}</td>
                  <td className="px-4 py-4 text-sm tabular-nums text-slate-600">{cashbook.transactions}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{cashbook.updated}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold tabular-nums text-slate-800">{formatAmount(cashbook.balance)}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${cashbook.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {cashbook.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link to="/transactions" aria-label={`Open ${cashbook.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {visibleCashbooks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Wallet className="mx-auto h-6 w-6 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-700">No cashbooks found</p>
                    <p className="mt-1 text-sm text-slate-500">Try a different search or status filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>Showing {visibleCashbooks.length} of {cashbooks.length} sample cashbooks</span>
          <span>Sample data</span>
        </div>
      </section>
    </div>
  );
}