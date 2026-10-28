import { useState, type FormEvent } from "react";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";

import useTransaction from "@/hooks/useTransaction";
import TransactionType from "@/entities/TransactionType";
import PaymentMode from "@/entities/PaymentMode";

interface TransactionFormProps {
  cashbookId: number;
  onSuccess?: () => void;
}

interface TransactionFormValues {
  transactionDate: string;
  type: TransactionType;
  amount: string;
  remarks: string;
  paymentMode: PaymentMode;
  categoryId: string;
  contactId: string;
}

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const TransactionForm = ({ cashbookId, onSuccess }: TransactionFormProps) => {
  const {
    createTransaction,
    data,
    errorMessage,
    isPending,
    isSuccess,
    reset,
  } = useTransaction();

  const [form, setForm] = useState<TransactionFormValues>({
    transactionDate: getToday(),
    type: "CASH_IN",
    amount: "",
    remarks: "",
    paymentMode: "CASH",
    categoryId: "",
    contactId: "",
  });

  const handleChange = (
    field: keyof TransactionFormValues,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    // Clear the previous error/success when the user edits the form.
    if (isSuccess || errorMessage) {
      reset();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();

    try {
      await createTransaction({
        transactionDate: form.transactionDate,
        type: form.type,
        amount: Number(form.amount),
        remarks: form.remarks.trim() || undefined,
        paymentMode: form.paymentMode,
        cashbookId,
        categoryId: form.categoryId
          ? Number(form.categoryId)
          : null,
        contactId: form.contactId
          ? Number(form.contactId)
          : null,
      });
      onSuccess?.();
    } catch {
      // The hook retains the error for display below.
    }
  };

  const inputClassName =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
  const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 py-2">
      {errorMessage && (
        <div role="alert" className="flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess && data && (
        <div role="status" className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong className="block font-semibold">Transaction recorded</strong>
            <span className="mt-0.5 block">Reference: {data.transactionNumber}</span>
          </span>
        </div>
      )}

      <fieldset>
        <legend className={labelClassName}>Transaction type</legend>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={form.type === "CASH_IN"}
            onClick={() => handleChange("type", "CASH_IN")}
            className={`flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition ${
              form.type === "CASH_IN"
                ? "border-emerald-700 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ArrowDownLeft className="h-4 w-4" />
            Money in
          </button>
          <button
            type="button"
            aria-pressed={form.type === "CASH_OUT"}
            onClick={() => handleChange("type", "CASH_OUT")}
            className={`flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition ${
              form.type === "CASH_OUT"
                ? "border-rose-700 bg-rose-50 text-rose-800 ring-1 ring-rose-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />
            Money out
          </button>
        </div>
      </fieldset>

      <div className="rounded-md bg-slate-50 p-4">
        <label htmlFor="transaction-amount" className={labelClassName}>
          Amount <span className="text-rose-600">*</span>
        </label>
        <div className="flex h-14 items-center rounded-md border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
          <span className="mr-3 border-r border-slate-200 pr-3 text-sm font-semibold text-slate-500">KSh</span>
          <input
            id="transaction-amount"
            className="h-full min-w-0 flex-1 bg-transparent text-2xl font-semibold tabular-nums text-slate-900 outline-none placeholder:text-slate-300"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(event) => handleChange("amount", event.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="transaction-date" className={labelClassName}>
            Date <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="transaction-date"
              className={`${inputClassName} pl-9`}
              type="date"
              value={form.transactionDate}
              onChange={(event) => handleChange("transactionDate", event.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="payment-mode" className={labelClassName}>
            Payment method <span className="text-rose-600">*</span>
          </label>
          <select
            id="payment-mode"
            className={inputClassName}
            value={form.paymentMode}
            onChange={(event) => handleChange("paymentMode", event.target.value)}
            required
          >
            <option value="CASH">Cash</option>
            <option value="MPESA">M-Pesa</option>
            <option value="BANK">Bank transfer</option>
            <option value="CARD">Card</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="transaction-remarks" className={labelClassName}>
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="transaction-remarks"
          className={`${inputClassName} h-20 resize-y py-2.5`}
          placeholder="What was this transaction for?"
          value={form.remarks}
          onChange={(event) => handleChange("remarks", event.target.value)}
          rows={3}
        />
      </div>

      <details className="group rounded-md border border-slate-200">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-slate-700 marker:hidden">
          <span className="flex items-center justify-between">
            Additional references <span className="text-xs font-normal text-slate-400">Optional</span>
          </span>
        </summary>
        <div className="grid gap-3 border-t border-slate-100 p-3 sm:grid-cols-2">
          <div>
            <label htmlFor="transaction-category" className={labelClassName}>Category ID</label>
            <input
              id="transaction-category"
              className={inputClassName}
              type="number"
              min="1"
              placeholder="e.g. 1"
              value={form.categoryId}
              onChange={(event) => handleChange("categoryId", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="transaction-contact" className={labelClassName}>Contact ID</label>
            <input
              id="transaction-contact"
              className={inputClassName}
              type="number"
              min="1"
              placeholder="e.g. 1"
              value={form.contactId}
              onChange={(event) => handleChange("contactId", event.target.value)}
            />
          </div>
        </div>
      </details>

      <button
        type="submit"
        disabled={isPending || !form.transactionDate || !form.amount || Number(form.amount) <= 0}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {isPending ? "Saving transaction..." : "Save transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;