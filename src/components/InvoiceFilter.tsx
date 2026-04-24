import { ChevronDownIcon } from "lucide-react";
import type { InvoiceStatus } from "@/src/types/invoice";

export type StatusFilterState =
  | { mode: "all" }
  | { mode: "statuses"; statuses: Set<InvoiceStatus> };

const STATUS_OPTIONS: InvoiceStatus[] = ["Draft", "Pending", "Paid"];

export type InvoiceStatusFilterProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filter: StatusFilterState;
  onSelectAll: () => void;
  onToggleStatus: (status: InvoiceStatus) => void;
};

export default function InvoiceStatusFilter({
  isOpen,
  onOpenChange,
  filter,
  onSelectAll,
  onToggleStatus,
}: InvoiceStatusFilterProps) {
  return (
    <div className="relative">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-2 text-sm font-bold text-[#0C0E16] transition-colors hover:bg-white/60 dark:text-slate-200 dark:hover:bg-slate-800/80 sm:gap-2 sm:text-base"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => onOpenChange(!isOpen)}
      >
        <span className="hidden sm:inline">Filter by status</span>
        <span className="sm:hidden">Filter</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div
          role="group"
          aria-label="Invoice status filters"
          className="absolute right-0 z-30 mt-2 min-w-[220px] space-y-3 rounded-lg border border-[#DFE3FA]/40 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-[#1E2139] md:left-0 md:right-auto"
        >
          <p className="text-xs text-[#888EB0] dark:text-slate-400">
            Choose <span className="font-bold">All</span> for every invoice, or pick one or more
            statuses (list shows invoices matching <span className="font-bold">any</span> selected
            status).
          </p>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-bold transition-colors hover:text-[#7C5DFA] dark:hover:text-[#9277FF]">
            <input
              type="checkbox"
              checked={filter.mode === "all"}
              onChange={(e) => {
                if (e.target.checked) onSelectAll();
              }}
              className="size-4 rounded border-[#7E88C3] accent-[#7C5DFA]"
            />
            All
          </label>
          {STATUS_OPTIONS.map((s) => (
            <label
              key={s}
              className="flex cursor-pointer items-center gap-3 text-sm font-bold transition-colors hover:text-[#7C5DFA] dark:hover:text-[#9277FF]"
            >
              <input
                type="checkbox"
                checked={filter.mode === "statuses" && filter.statuses.has(s)}
                onChange={() => onToggleStatus(s)}
                className="size-4 rounded border-[#7E88C3] accent-[#7C5DFA]"
              />
              {s}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
