import { BookOpenText, CircleDollarSign } from "lucide-react";

interface CashbookMarkProps {
  className?: string;
  iconClassName?: string;
}

export default function CashbookMark({
  className = "h-12 w-12 rounded-xl",
  iconClassName = "h-6 w-6",
}: CashbookMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center bg-emerald-600 text-white shadow-sm ${className}`}
    >
      <BookOpenText className={iconClassName} strokeWidth={1.8} />
      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-emerald-950 ring-2 ring-white">
        <CircleDollarSign className="h-3 w-3" strokeWidth={2.2} />
      </span>
    </span>
  );
}
