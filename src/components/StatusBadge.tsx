import type { InvoiceStatus } from "@/src/types/invoice";

function badgeSurface(status: InvoiceStatus, compact?: boolean): string {
  const pad = compact ? "px-4 py-2.5 text-sm" : "px-6 py-3";
  switch (status) {
    case "Paid":
      return `bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 font-bold ${pad} rounded-md flex items-center gap-2`;
    case "Pending":
      return `bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-bold ${pad} rounded-md flex items-center gap-2`;
    default:
      return `bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 font-bold ${pad} rounded-md flex items-center gap-2`;
  }
}

function badgeDot(status: InvoiceStatus): string {
  switch (status) {
    case "Paid":
      return "bg-green-500";
    case "Pending":
      return "bg-orange-500";
    default:
      return "bg-gray-500 dark:bg-slate-400";
  }
}

export type StatusBadgeProps = {
  status: InvoiceStatus;
  compact?: boolean;
  className?: string;
};

export default function StatusBadge({ status, compact, className }: StatusBadgeProps) {
  const root = [badgeSurface(status, compact), className].filter(Boolean).join(" ");
  return (
    <div className={root} role="status">
      <span className={`h-2 w-2 shrink-0 rounded-full ${badgeDot(status)}`} aria-hidden />
      {status}
    </div>
  );
}
