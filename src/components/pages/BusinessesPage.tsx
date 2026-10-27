import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  CirclePlus,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useBusinesses from "@/hooks/useBusinesses";
import useCreateBusiness from "@/hooks/useCreateBusiness";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-KE", { dateStyle: "medium" }).format(date);
};

export default function BusinessesPage() {
  const [searchParams] = useSearchParams();
  const { businesses, errorMessage, isError, isLoading } = useBusinesses();
  const {
    createBusiness,
    errorMessage: createErrorMessage,
    isPending,
    reset,
  } = useCreateBusiness();
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(() => searchParams.get("new") === "1");

  const visibleBusinesses = useMemo(() => {
    const search = query.trim().toLowerCase();
    return businesses.filter((business) =>
      `${business.businessName} ${business.email ?? ""} ${business.phoneNumber ?? ""} ${business.address ?? ""}`
        .toLowerCase()
        .includes(search),
    );
  }, [businesses, query]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const businessName = String(formData.get("businessName") ?? "").trim();
    if (!businessName) return;

    reset();
    try {
      await createBusiness({
        businessName,
        email: String(formData.get("email") ?? "").trim() || undefined,
        phoneNumber: String(formData.get("phoneNumber") ?? "").trim() || undefined,
        address: String(formData.get("address") ?? "").trim() || undefined,
      });
      setDialogOpen(false);
    } catch {
      // The mutation retains the server error for display in the dialog.
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Management / Businesses
          </p>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Businesses</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage the businesses connected to your account.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <CirclePlus className="h-4 w-4" />
              New business
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add a business</DialogTitle>
              <DialogDescription>
                Enter the business details to create it in your account.
              </DialogDescription>
            </DialogHeader>
            <form key={String(dialogOpen)} onSubmit={handleCreate} className="space-y-4 pt-2">
              {createErrorMessage && (
                <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  {createErrorMessage}
                </p>
              )}
              <div>
                <label htmlFor="business-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Business name
                </label>
                <input
                  id="business-name"
                  name="businessName"
                  autoFocus
                  required
                  maxLength={120}
                  placeholder="e.g. Downtown Store"
                  className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label htmlFor="business-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="business-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="business-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone number
                  </label>
                  <input
                    id="business-phone"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Optional"
                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label htmlFor="business-address" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <input
                    id="business-address"
                    name="address"
                    placeholder="Optional"
                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {isPending ? "Creating..." : "Create business"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">Businesses</p>
          <p className="mt-1 font-display text-2xl font-semibold text-slate-900">{businesses.length}</p>
        </div>
        <label className="relative block sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search businesses"
            aria-label="Search businesses"
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </section>

      {isError && (
        <div role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {errorMessage || "Unable to load businesses."}
        </div>
      )}
      {isLoading && (
        <div className="py-12 text-center text-sm text-slate-500">
          <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />
          Loading businesses...
        </div>
      )}

      {!isLoading && !isError && (
        <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          {visibleBusinesses.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {visibleBusinesses.map((business) => (
                <article key={business.id} className="flex gap-4 px-4 py-5 sm:px-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                      <div>
                        <h2 className="truncate text-sm font-semibold text-slate-900">{business.businessName}</h2>
                        <p className="mt-1 text-xs text-slate-500">Business #{business.id} · Owner #{business.ownerId}</p>
                      </div>
                      <p className="shrink-0 text-xs text-slate-500">Added {formatDate(business.createdAt)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                      {business.email && <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{business.email}</span>}
                      {business.phoneNumber && <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{business.phoneNumber}</span>}
                      {business.address && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{business.address}</span>}
                      {!business.email && !business.phoneNumber && !business.address && (
                        <span className="text-slate-400">No contact details</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="px-5 py-14 text-center">
              <Building2 className="mx-auto h-6 w-6 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">No businesses found</p>
              <p className="mt-1 text-sm text-slate-500">Try another search or create a business.</p>
            </div>
          )}
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Showing {visibleBusinesses.length} of {businesses.length} businesses
          </div>
        </section>
      )}
    </div>
  );
}