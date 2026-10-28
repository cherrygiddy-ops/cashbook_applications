import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CirclePlus,
  Download,
  Mail,
  MoreHorizontal,
  Search,
  Settings2,
  Tags,
  Users,
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

const fieldClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const primaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800";

function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SampleBadge() {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      Sample data
    </span>
  );
}

function CreateDialog({
  title,
  description,
  buttonLabel,
  children,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={primaryButtonClass}>
          <CirclePlus className="h-4 w-4" />
          {buttonLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children(() => setOpen(false))}
      </DialogContent>
    </Dialog>
  );
}

interface Category {
  name: string;
  direction: "Income" | "Expense";
  transactions: number;
  total: number;
  color: string;
}

const initialCategories: Category[] = [
  { name: "Sales revenue", direction: "Income", transactions: 42, total: 284500, color: "bg-emerald-500" },
  { name: "Services", direction: "Income", transactions: 18, total: 126000, color: "bg-sky-500" },
  { name: "Rent & utilities", direction: "Expense", transactions: 14, total: 68200, color: "bg-amber-500" },
  { name: "Inventory", direction: "Expense", transactions: 27, total: 114600, color: "bg-rose-500" },
  { name: "Transport", direction: "Expense", transactions: 19, total: 28400, color: "bg-violet-500" },
  { name: "Supplies", direction: "Expense", transactions: 11, total: 16750, color: "bg-teal-500" },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

export function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All types");
  const visible = categories.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase()) &&
    (filter === "All types" || category.direction === filter),
  );
  const addCategory = (event: FormEvent<HTMLFormElement>, close: () => void) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const direction = String(data.get("direction")) as Category["direction"];
    if (!name) return;
    setCategories((current) => [...current, { name, direction, transactions: 0, total: 0, color: "bg-indigo-500" }]);
    close();
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <PageHeading eyebrow="Management / Classification" title="Categories" description="Organise income and expenses so every report tells a useful story.">
        <CreateDialog title="Add a category" description="Create a label for future transactions." buttonLabel="New category">
          {(close) => (
            <form onSubmit={(event) => addCategory(event, close)} className="space-y-4 pt-2">
              <label className="block text-sm font-medium text-slate-700">Category name<input name="name" required placeholder="e.g. Equipment" className={`${fieldClass} mt-1.5`} /></label>
              <label className="block text-sm font-medium text-slate-700">Type<select name="direction" className={`${fieldClass} mt-1.5`}><option>Expense</option><option>Income</option></select></label>
              <button className={`${primaryButtonClass} w-full`} type="submit">Create category</button>
            </form>
          )}
        </CreateDialog>
      </PageHeading>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "All categories", value: categories.length, icon: Tags, style: "bg-slate-100 text-slate-700" },
          { label: "Income categories", value: categories.filter((item) => item.direction === "Income").length, icon: ArrowDownLeft, style: "bg-emerald-50 text-emerald-700" },
          { label: "Expense categories", value: categories.filter((item) => item.direction === "Expense").length, icon: ArrowUpRight, style: "bg-rose-50 text-rose-700" },
        ].map((item) => <div key={item.label} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm"><div><p className="text-sm text-slate-500">{item.label}</p><p className="mt-1 font-display text-2xl font-semibold text-slate-900">{item.value}</p></div><span className={`rounded-md p-2.5 ${item.style}`}><item.icon className="h-5 w-5" /></span></div>)}
      </div>

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><div className="flex items-center gap-2"><h2 className="font-display text-lg font-semibold text-slate-900">Category list</h2><SampleBadge /></div><p className="mt-1 text-sm text-slate-500">Monthly totals by transaction category</p></div>
          <div className="flex gap-2"><label className="relative block sm:w-56"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories" className={`${fieldClass} pl-9`} /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} className={`${fieldClass} w-36`}><option>All types</option><option>Income</option><option>Expense</option></select></div>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="px-5 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Transactions</th><th className="px-4 py-3 font-medium">Monthly total</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((category) => <tr key={category.name} className="hover:bg-slate-50/70"><td className="px-5 py-4"><span className="flex items-center gap-3 text-sm font-semibold text-slate-800"><span className={`h-2.5 w-2.5 rounded-full ${category.color}`} />{category.name}</span></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${category.direction === "Income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{category.direction}</span></td><td className="px-4 py-4 text-sm tabular-nums text-slate-600">{category.transactions}</td><td className="px-4 py-4 text-sm font-medium tabular-nums text-slate-800">{money(category.total)}</td><td className="px-5 py-4 text-right"><button type="button" aria-label={`More actions for ${category.name}`} className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {visible.length} of {categories.length} categories · Sample data</div>
      </section>
    </div>
  );
}

interface ContactItem {
  name: string;
  company: string;
  email: string;
  phone: string;
  type: "Customer" | "Supplier" | "Both";
  transactions: number;
  total: number;
}

const initialContacts: ContactItem[] = [
  { name: "Amina Wanjiku", company: "Amina Consulting", email: "amina@example.com", phone: "+254 712 345 678", type: "Customer", transactions: 12, total: 146000 },
  { name: "Nairobi Wholesale Ltd", company: "Nairobi Wholesale Ltd", email: "orders@nairobiwholesale.co.ke", phone: "+254 722 440 019", type: "Supplier", transactions: 21, total: 214500 },
  { name: "Kilimani Properties", company: "Kilimani Properties", email: "accounts@kilimaniproperties.co.ke", phone: "+254 700 881 240", type: "Supplier", transactions: 8, total: 224000 },
  { name: "J. Mwangi", company: "Independent client", email: "jm@example.com", phone: "+254 733 120 650", type: "Customer", transactions: 4, total: 82500 },
  { name: "PackPro Kenya", company: "PackPro Kenya", email: "hello@packpro.co.ke", phone: "+254 711 650 224", type: "Both", transactions: 7, total: 35800 },
];

export function ContactsPage() {
  const [contacts, setContacts] = useState(initialContacts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All contacts");
  const visible = contacts.filter((contact) => `${contact.name} ${contact.company} ${contact.email}`.toLowerCase().includes(query.trim().toLowerCase()) && (filter === "All contacts" || contact.type === filter));
  const addContact = (event: FormEvent<HTMLFormElement>, close: () => void) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;
    setContacts((current) => [{ name, company: String(data.get("company") || name), email: String(data.get("email") || "Not provided"), phone: String(data.get("phone") || "Not provided"), type: String(data.get("type")) as ContactItem["type"], transactions: 0, total: 0 }, ...current]);
    close();
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <PageHeading eyebrow="Management / Relationships" title="Contacts" description="Keep customer and supplier details close to the transactions they belong to.">
        <CreateDialog title="Add a contact" description="Save a customer, supplier, or both." buttonLabel="New contact">
          {(close) => <form onSubmit={(event) => addContact(event, close)} className="space-y-4 pt-2"><label className="block text-sm font-medium text-slate-700">Contact name<input name="name" required placeholder="Full name" className={`${fieldClass} mt-1.5`} /></label><label className="block text-sm font-medium text-slate-700">Business name<input name="company" placeholder="Company (optional)" className={`${fieldClass} mt-1.5`} /></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-slate-700">Email<input name="email" type="email" placeholder="name@example.com" className={`${fieldClass} mt-1.5`} /></label><label className="block text-sm font-medium text-slate-700">Phone<input name="phone" placeholder="+254..." className={`${fieldClass} mt-1.5`} /></label></div><label className="block text-sm font-medium text-slate-700">Contact type<select name="type" className={`${fieldClass} mt-1.5`}><option>Customer</option><option>Supplier</option><option>Both</option></select></label><button type="submit" className={`${primaryButtonClass} w-full`}>Save contact</button></form>}
        </CreateDialog>
      </PageHeading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{[{ label: "Total contacts", value: contacts.length, icon: Users, tone: "bg-slate-100 text-slate-700" }, { label: "Customers", value: contacts.filter((contact) => contact.type !== "Supplier").length, icon: ArrowDownLeft, tone: "bg-emerald-50 text-emerald-700" }, { label: "Suppliers", value: contacts.filter((contact) => contact.type !== "Customer").length, icon: ArrowDownRight, tone: "bg-amber-50 text-amber-700" }].map((item) => <div key={item.label} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm"><div><p className="text-sm text-slate-500">{item.label}</p><p className="mt-1 font-display text-2xl font-semibold text-slate-900">{item.value}</p></div><span className={`rounded-md p-2.5 ${item.tone}`}><item.icon className="h-5 w-5" /></span></div>)}</div>
      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="font-display text-lg font-semibold text-slate-900">Contact directory</h2><SampleBadge /></div><p className="mt-1 text-sm text-slate-500">People and organisations linked to your books</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative block sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search contacts" className={`${fieldClass} pl-9`} /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} className={`${fieldClass} sm:w-40`}><option>All contacts</option><option>Customer</option><option>Supplier</option><option>Both</option></select></div></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="px-5 py-3 font-medium">Contact</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Phone / email</th><th className="px-4 py-3 font-medium">Transactions</th><th className="px-4 py-3 text-right font-medium">Volume</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((contact) => <tr key={contact.name} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-sm font-semibold text-slate-800">{contact.name}</p><p className="mt-0.5 text-xs text-slate-500">{contact.company}</p></td><td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{contact.type}</span></td><td className="px-4 py-4"><p className="text-sm text-slate-700">{contact.phone}</p><p className="mt-0.5 text-xs text-slate-500">{contact.email}</p></td><td className="px-4 py-4 text-sm tabular-nums text-slate-600">{contact.transactions}</td><td className="px-4 py-4 text-right text-sm font-medium tabular-nums text-slate-800">{money(contact.total)}</td><td className="px-5 py-4 text-right"><button type="button" aria-label={`More actions for ${contact.name}`} className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table></div><div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {visible.length} of {contacts.length} sample contacts</div></section>
    </div>
  );
}

interface Member {
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
  initials: string;
}

const initialMembers: Member[] = [
  { name: "Grace Njeri", email: "grace@sample.co.ke", role: "Owner", status: "Active", initials: "GN" },
  { name: "Peter Kamau", email: "peter@sample.co.ke", role: "Admin", status: "Active", initials: "PK" },
  { name: "David Otieno", email: "david@sample.co.ke", role: "Editor", status: "Active", initials: "DO" },
  { name: "Mercy Wambui", email: "mercy@sample.co.ke", role: "Viewer", status: "Invited", initials: "MW" },
];

export function BusinessMembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const visible = members.filter((member) => `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(query.trim().toLowerCase()));
  const invite = (event: FormEvent<HTMLFormElement>, close: () => void) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const name = String(data.get("name") ?? "").trim() || email.split("@")[0];
    const role = String(data.get("role")) as Member["role"];
    if (!email) return;
    setMembers((current) => [{ name, email, role, status: "Invited", initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() }, ...current]);
    close();
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <PageHeading eyebrow="Management / Access" title="Business members" description="Manage who can access your cashbooks and what they can do.">
        <CreateDialog title="Invite a member" description="They will appear as invited until they accept." buttonLabel="Invite member">
          {(close) => <form onSubmit={(event) => invite(event, close)} className="space-y-4 pt-2"><label className="block text-sm font-medium text-slate-700">Name<input name="name" placeholder="Full name" className={`${fieldClass} mt-1.5`} /></label><label className="block text-sm font-medium text-slate-700">Email address<input name="email" required type="email" placeholder="person@business.com" className={`${fieldClass} mt-1.5`} /></label><label className="block text-sm font-medium text-slate-700">Access role<select name="role" className={`${fieldClass} mt-1.5`}><option>Editor</option><option>Admin</option><option>Viewer</option></select></label><button type="submit" className={`${primaryButtonClass} w-full`}><Mail className="h-4 w-4" />Send invitation</button></form>}
        </CreateDialog>
      </PageHeading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{[{ label: "Team members", value: members.length, icon: Users }, { label: "Active members", value: members.filter((member) => member.status === "Active").length, icon: Check }, { label: "Pending invites", value: members.filter((member) => member.status === "Invited").length, icon: Mail }].map((item) => <div key={item.label} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm"><div><p className="text-sm text-slate-500">{item.label}</p><p className="mt-1 font-display text-2xl font-semibold text-slate-900">{item.value}</p></div><span className="rounded-md bg-sky-50 p-2.5 text-sky-700"><item.icon className="h-5 w-5" /></span></div>)}</div>
      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="font-display text-lg font-semibold text-slate-900">People with access</h2><SampleBadge /></div><p className="mt-1 text-sm text-slate-500">Business workspace members and invitations</p></div><label className="relative block sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members" className={`${fieldClass} pl-9`} /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="px-5 py-3 font-medium">Member</th><th className="px-4 py-3 font-medium">Role</th><th className="px-4 py-3 font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((member) => <tr key={member.email} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">{member.initials}</span><span><span className="block text-sm font-semibold text-slate-800">{member.name}</span><span className="mt-0.5 block text-xs text-slate-500">{member.email}</span></span></div></td><td className="px-4 py-4"><select aria-label={`Role for ${member.name}`} disabled={member.role === "Owner"} value={member.role} onChange={(event) => setMembers((current) => current.map((item) => item.email === member.email ? { ...item, role: event.target.value as Member["role"] } : item))} className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 disabled:opacity-70"><option>Owner</option><option>Admin</option><option>Editor</option><option>Viewer</option></select></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{member.status}</span></td><td className="px-5 py-4 text-right"><button type="button" disabled={member.role === "Owner"} onClick={() => setMembers((current) => current.filter((item) => item.email !== member.email))} className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-30">Remove</button></td></tr>)}</tbody></table></div><div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Roles and invitations are a local preview and are not sent to a server.</div></section>
    </div>
  );
}

const reportMonths = [
  { month: "Mar", income: 54, expenses: 35 },
  { month: "Apr", income: 68, expenses: 42 },
  { month: "May", income: 61, expenses: 39 },
  { month: "Jun", income: 77, expenses: 48 },
  { month: "Jul", income: 72, expenses: 45 },
  { month: "Aug", income: 88, expenses: 53 },
];

export function ReportsPage() {
  const [period, setPeriod] = useState("Last 6 months");
  const income = period === "This month" ? 154250 : 725800;
  const expenses = period === "This month" ? 55100 : 326400;
  const net = income - expenses;
  const categories = [
    { name: "Inventory", amount: 114600, share: 35, color: "bg-rose-500" },
    { name: "Rent & utilities", amount: 68200, share: 21, color: "bg-amber-500" },
    { name: "Transport", amount: 28400, share: 9, color: "bg-sky-500" },
    { name: "Supplies", amount: 16750, share: 5, color: "bg-violet-500" },
  ];
  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-10">
      <PageHeading eyebrow="Insights / Performance" title="Reports" description="Understand where money comes from and where it goes.">
        <div className="flex gap-2"><label className="sr-only" htmlFor="report-period">Report period</label><select id="report-period" value={period} onChange={(event) => setPeriod(event.target.value)} className={`${fieldClass} w-40`}><option>Last 6 months</option><option>This month</option></select><button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" />Export</button></div>
      </PageHeading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{[{ label: "Total income", value: money(income), icon: ArrowDownLeft, tone: "bg-emerald-50 text-emerald-700" }, { label: "Total expenses", value: money(expenses), icon: ArrowUpRight, tone: "bg-rose-50 text-rose-700" }, { label: "Net cash flow", value: money(net), icon: ArrowDownRight, tone: "bg-sky-50 text-sky-700" }].map((item) => <div key={item.label} className="flex items-start justify-between rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm"><div><p className="text-sm font-medium text-slate-500">{item.label}</p><p className="mt-2 font-display text-2xl font-semibold text-slate-900">{item.value}</p><p className="mt-1 text-xs text-slate-500">{period}</p></div><span className={`rounded-md p-2.5 ${item.tone}`}><item.icon className="h-5 w-5" /></span></div>)}</div>
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><h2 className="font-display text-lg font-semibold text-slate-900">Income vs expenses</h2><SampleBadge /></div><p className="mt-1 text-sm text-slate-500">Monthly cash movement · KSh thousands</p></div><BarChart3 className="h-5 w-5 text-slate-400" /></div><div className="mt-7 flex h-56 items-end gap-3 border-b border-slate-200 pb-0 sm:gap-5">{reportMonths.map((item) => <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end"><div className="flex h-[190px] w-full items-end justify-center gap-1.5 sm:gap-2"><div title={`Income ${item.income}k`} className="w-4 rounded-t-sm bg-emerald-600 sm:w-7" style={{ height: `${item.income}%` }} /><div title={`Expenses ${item.expenses}k`} className="w-4 rounded-t-sm bg-rose-300 sm:w-7" style={{ height: `${item.expenses}%` }} /></div><span className="mt-2 text-xs text-slate-500">{period === "This month" ? "Aug" : item.month}</span></div>)}</div><div className="mt-4 flex gap-5 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />Income</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-rose-300" />Expenses</span></div></section>
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"><div className="flex items-start justify-between"><div><h2 className="font-display text-lg font-semibold text-slate-900">Top expenses</h2><p className="mt-1 text-sm text-slate-500">By category · this period</p></div><Tags className="h-5 w-5 text-slate-400" /></div><div className="mt-6 space-y-5">{categories.map((category) => <div key={category.name}><div className="mb-2 flex items-center justify-between gap-3"><span className="truncate text-sm font-medium text-slate-700">{category.name}</span><span className="whitespace-nowrap text-sm font-semibold tabular-nums text-slate-800">{money(category.amount)}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${category.color}`} style={{ width: `${category.share * 2.2}%` }} /></div></div>)}</div><div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">Based on recorded expense categories</div></section>
      </div>
      <section className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="rounded-md bg-emerald-50 p-2.5 text-emerald-700"><Wallet className="h-5 w-5" /></span><span><span className="block text-sm font-semibold text-slate-800">Cash position is positive</span><span className="mt-0.5 block text-sm text-slate-500">Income exceeds expenses by {money(net)} for {period.toLowerCase()}.</span></span></div><SampleBadge /></section>
    </div>
  );
}

export function SettingsPage() {
  const [businessName, setBusinessName] = useState("Njeri General Supplies");
  const [currency, setCurrency] = useState("KES");
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({ email: true, weekly: true, transaction: false, twoFactor: false });
  const toggle = (key: keyof typeof preferences) => setPreferences((current) => ({ ...current, [key]: !current[key] }));
  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };
  const preferenceRows: { key: keyof typeof preferences; title: string; description: string }[] = [
    { key: "email", title: "Important account updates", description: "Receive security and account notifications by email." },
    { key: "weekly", title: "Weekly cashbook summary", description: "Get a concise snapshot of activity each week." },
    { key: "transaction", title: "Transaction confirmations", description: "Email a confirmation after a transaction is recorded." },
    { key: "twoFactor", title: "Two-step verification", description: "Require an extra verification step when signing in." },
  ];
  return (
    <div className="mx-auto w-full max-w-5xl space-y-7 pb-10">
      <PageHeading eyebrow="Workspace / Preferences" title="Settings" description="Manage your business details, defaults, and notifications." />
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">{[{ label: "Business profile", icon: BriefcaseBusiness }, { label: "Preferences", icon: Settings2 }, { label: "Notifications", icon: Mail }, { label: "Security", icon: Check }].map((item, index) => <a key={item.label} href={`#settings-${index}`} className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm ${index === 0 ? "bg-emerald-50 font-semibold text-emerald-800" : "text-slate-600 hover:bg-slate-100"}`}><item.icon className="h-4 w-4" />{item.label}</a>)}</nav>
        <form onSubmit={saveSettings} className="space-y-6">
          <section id="settings-0" className="rounded-md border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-display text-lg font-semibold text-slate-900">Business profile</h2><p className="mt-1 text-sm text-slate-500">Details shown on your workspace and reports</p></div><div className="grid gap-4 p-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Business name<input value={businessName} onChange={(event) => setBusinessName(event.target.value)} className={`${fieldClass} mt-1.5`} /></label><label className="block text-sm font-medium text-slate-700">Default currency<select value={currency} onChange={(event) => setCurrency(event.target.value)} className={`${fieldClass} mt-1.5`}><option value="KES">Kenyan Shilling (KES)</option><option value="USD">US Dollar (USD)</option><option value="UGX">Ugandan Shilling (UGX)</option><option value="TZS">Tanzanian Shilling (TZS)</option></select></label><label className="block text-sm font-medium text-slate-700">Country<input value="Kenya" readOnly className={`${fieldClass} mt-1.5 bg-slate-50 text-slate-500`} /></label><label className="block text-sm font-medium text-slate-700">Date format<select defaultValue="DD MMM YYYY" className={`${fieldClass} mt-1.5`}><option>DD MMM YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></label></div></section>
          <section id="settings-1" className="rounded-md border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-display text-lg font-semibold text-slate-900">Notifications & security</h2><p className="mt-1 text-sm text-slate-500">Choose what updates you receive</p></div><div id="settings-2" className="divide-y divide-slate-100">{preferenceRows.map((item) => <label key={item.key} id={item.key === "twoFactor" ? "settings-3" : undefined} className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"><span><span className="block text-sm font-medium text-slate-800">{item.title}</span><span className="mt-0.5 block text-sm text-slate-500">{item.description}</span></span><input type="checkbox" checked={preferences[item.key]} onChange={() => toggle(item.key)} className="h-4 w-4 shrink-0 accent-emerald-700" /></label>)}</div></section>
          <div className="flex items-center justify-end gap-3"><span aria-live="polite" className="text-sm text-emerald-700">{saved ? "Settings saved locally" : "Sample settings"}</span><button type="submit" className={primaryButtonClass}>Save changes</button></div>
        </form>
      </div>
    </div>
  );
}