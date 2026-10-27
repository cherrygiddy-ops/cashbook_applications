import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  ArrowRight,
  BriefcaseBusiness,
  BookOpenCheck,
  Check,
  ChevronDown,
  Plus,
  LoaderCircle,
  Search,
  SlidersHorizontal,
  Wallet,
  LibraryBig,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCashbooks from "@/hooks/useCashbooks";
import useCreateCashbook from "@/hooks/useCreateCashbook";
import useBusinesses from "@/hooks/useBusinesses";
import { useAuthStore } from "@/Store/AuthStore";

const quickBookNames = ["October Expenses", "2026 Ledger", "Payable Book", "Purchase Order Book"];

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

export default function CashbooksPage() {
  const { cashbooks, errorMessage, isError, isLoading } = useCashbooks();
  const { businesses } = useBusinesses();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    createCashbook,
    errorMessage: createErrorMessage,
    isPending,
    reset: resetCreate,
  } = useCreateCashbook();
  const [query, setQuery] = useState("");
  const [businessQuery, setBusinessQuery] = useState("");
  const [businessPickerOpen, setBusinessPickerOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState("all");
  const [sortOrder, setSortOrder] = useState("updated");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessId, setBusinessId] = useState("");

  let tokenClaims: { id?: number | string; userId?: number | string; sub?: number | string } = {};
  if (accessToken) {
    try {
      tokenClaims = jwtDecode(accessToken);
    } catch {
      tokenClaims = {};
    }
  }
  const userId = [user?.id, user?.userId, tokenClaims.userId, tokenClaims.id, tokenClaims.sub]
    .map((value) => Number(value))
    .find((value) => Number.isInteger(value) && value > 0);
  const userCashbooks = useMemo(() => {
    const ownedBusinessIds = new Set(
      businesses.filter((business) => business.ownerId === userId).map((business) => business.id),
    );
    const hasOwnershipData =
      cashbooks.some((cashbook) => cashbook.ownerId != null) ||
      businesses.some((business) => business.ownerId != null);
    return userId != null && hasOwnershipData
      ? cashbooks.filter((cashbook) =>
          cashbook.ownerId === userId || ownedBusinessIds.has(cashbook.businessId),
        )
      : cashbooks;
  }, [businesses, cashbooks, userId]);

  const visibleCashbooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return userCashbooks
      .filter((cashbook) => selectedBusinessId === "all" || cashbook.businessId === Number(selectedBusinessId))
      .filter((cashbook) =>
        `${cashbook.name} ${cashbook.description ?? ""} ${cashbook.businessId} ${cashbook.id}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .sort((left, right) => {
        if (sortOrder === "name") return left.name.localeCompare(right.name);
        const leftDate = new Date(sortOrder === "created" ? left.createdAt : left.updatedAt).getTime();
        const rightDate = new Date(sortOrder === "created" ? right.createdAt : right.updatedAt).getTime();
        return rightDate - leftDate;
      });
  }, [userCashbooks, query, selectedBusinessId, sortOrder]);

  const businessCount = new Set(userCashbooks.map((cashbook) => cashbook.businessId)).size;
  const selectedBusiness = businesses.find((business) => String(business.id) === selectedBusinessId);
  const filteredBusinesses = businesses.filter((business) =>
    business.businessName.toLowerCase().includes(businessQuery.trim().toLowerCase()),
  );

  const handleCreateCashbook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName || !businessId) return;

    resetCreate();
    try {
      await createCashbook({
        name: cleanName,
        description: description.trim() || undefined,
        businessId: Number(businessId),
      });
      setName("");
      setDescription("");
      setBusinessId("");
      setDialogOpen(false);
    } catch {
      // The mutation retains the API error for display in the dialog.
    }
  };

  const openCreateCashbook = (bookName = "") => {
    resetCreate();
    setName(bookName);
    setBusinessId(selectedBusinessId === "all" ? "" : selectedBusinessId);
    setDialogOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] pb-10">
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col items-start gap-3">
          <div className="relative w-full sm:w-72">
            <button
              type="button"
              aria-expanded={businessPickerOpen}
              aria-haspopup="listbox"
              onClick={() => setBusinessPickerOpen((open) => !open)}
              className="flex h-11 w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-left shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <BriefcaseBusiness className="h-4 w-4 shrink-0 text-indigo-600" />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-800">
                {selectedBusiness?.businessName ?? "All businesses"}
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${businessPickerOpen ? "rotate-180" : ""}`} />
            </button>
            {businessPickerOpen && (
              <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
                <label className="flex items-center gap-2 border-b border-slate-100 px-3">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    autoFocus
                    value={businessQuery}
                    onChange={(event) => setBusinessQuery(event.target.value)}
                    placeholder="Search business"
                    aria-label="Search businesses"
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => { setSelectedBusinessId("all"); setBusinessQuery(""); setBusinessPickerOpen(false); }}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-indigo-50"
                >
                  All businesses {selectedBusinessId === "all" && <Check className="h-4 w-4 text-indigo-600" />}
                </button>
                {filteredBusinesses.map((business) => (
                  <button
                    type="button"
                    key={business.id}
                    onClick={() => { setSelectedBusinessId(String(business.id)); setBusinessQuery(""); setBusinessPickerOpen(false); }}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-indigo-50"
                  >
                    {business.businessName}
                    {selectedBusinessId === String(business.id) && <Check className="h-4 w-4 text-indigo-600" />}
                  </button>
                ))}
                {filteredBusinesses.length === 0 && <p className="px-3 py-3 text-sm text-slate-500">No businesses found.</p>}
                <Link to="/businesses" onClick={() => setBusinessPickerOpen(false)} className="flex items-center gap-2 border-t border-slate-100 px-3 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
                  <Plus className="h-4 w-4" /> Add New Business
                </Link>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{selectedBusiness?.businessName ?? "Cashbooks"}</h1>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add a new cashbook</DialogTitle>
              <DialogDescription>
                Create a cashbook linked to a business.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCashbook} className="space-y-4 pt-2">
              {createErrorMessage && (
                <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  {createErrorMessage}
                </p>
              )}
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
                <label htmlFor="cashbook-description" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="cashbook-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder="Optional details"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                  <label htmlFor="cashbook-business-id" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Business
                </label>
                <select
                  id="cashbook-business-id"
                  required
                  value={businessId}
                  onChange={(event) => setBusinessId(event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Choose a business</option>
                  {businesses.map((business) => <option key={business.id} value={business.id}>{business.businessName}</option>)}
                </select>
                <Link to="/businesses?new=1" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  <Plus className="h-4 w-4" /> Add New Business
                </Link>
              </div>
              <button
                type="submit"
                disabled={isPending || !businessId}
                style={{
                  position: "sticky",
                  bottom: 0,
                  zIndex: 10,
                  backgroundColor: businessId || isPending ? "#4f46e5" : "#e2e8f0",
                  color: businessId || isPending ? "#ffffff" : "#334155",
                }}
                className="sticky bottom-0 z-10 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
              >
                {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {isPending ? "Creating..." : businessId ? "Add Cashbook" : "Choose a business to continue"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block min-w-0 flex-1 sm:max-w-[440px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by book name..."
                aria-label="Search cashbooks"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600 sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <span className="whitespace-nowrap">Sort by:</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort cashbooks" className="min-w-0 bg-transparent font-medium text-slate-700 outline-none">
                <option value="updated">Last updated</option>
                <option value="created">Date created</option>
                <option value="name">Name</option>
              </select>
            </label>
        </div>
        <button
          type="button"
          onClick={() => openCreateCashbook()}
          style={{ backgroundColor: "#4f46e5" }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:ml-auto sm:w-64"
        >
          <Plus className="h-4 w-4" /> Add New Book
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_268px]">
        <div className="min-w-0">
        {isError && (
          <div role="alert" className="mb-4 rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {errorMessage || "Unable to load cashbooks."}
          </div>
        )}
        {isLoading && (
          <div className="py-10 text-center text-sm text-slate-500">
            <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />
            Loading cashbooks...
          </div>
        )}

        <div className={`${isLoading || isError ? "hidden " : ""}divide-y divide-slate-200 border-y border-slate-200`}>
          {visibleCashbooks.map((cashbook) => (
            <Link
              key={cashbook.id}
              to={`/transactions?cashbookId=${cashbook.id}`}
              aria-label={`View transactions for ${cashbook.name}`}
              className="flex min-h-[76px] items-center justify-between gap-3 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
            >
              <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <BookOpenCheck className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800">{cashbook.name}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{cashbook.description || `Updated ${formatDate(cashbook.updatedAt)}`}</span>
                  </span>
              </div>
              <span aria-hidden="true" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-indigo-600">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
          {!isLoading && !isError && visibleCashbooks.length === 0 && (
            <div className="py-14 text-center">
              <Wallet className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">No cashbooks found</p>
              <p className="mt-1 text-sm text-slate-500">Try a different search.</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {visibleCashbooks.length} of {userCashbooks.length} books</span>
          <span>{businessCount} businesses</span>
        </div>
        </div>

        <aside className="self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Wallet className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">Keep your books organised</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Create a separate cashbook for each part of your business and keep transactions easy to review.
            </p>
            <button type="button" onClick={() => openCreateCashbook()} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Create a cashbook <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      </div>

      <section className="mt-7 rounded-md border border-slate-200 bg-white p-4 sm:p-5 lg:mr-[300px]">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <LibraryBig className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">Add New Book</h2>
            <p className="mt-1 text-xs text-slate-500">Start with a common book type</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickBookNames.map((bookName) => (
                <button
                  type="button"
                  key={bookName}
                  onClick={() => openCreateCashbook(bookName)}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100"
                >
                  {bookName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}