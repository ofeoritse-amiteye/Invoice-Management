import { useMemo, useState } from "react";
import Sidebar from "@/src/components/sidebar";
import InvoiceForm from "@/src/components/CreateEdit";
import InvoiceDetail from "@/src/components/viewInvoice";
import DeleteModal from "@/src/components/modals";
import InvoiceStatusFilter, {
  type StatusFilterState,
} from "@/src/components/InvoiceStatusFilter";
import StatusBadge from "@/src/components/StatusBadge";
import { useInvoices } from "@/src/context/InvoiceContext";
import type { Invoice, InvoiceStatus } from "@/src/types/invoice";
import { formatDisplayDate, formatMoney, invoiceTotal } from "@/src/lib/format";
import { generateInvoiceId } from "@/src/lib/id";

export default function InvoiceDashboard() {
  const { invoices, hydrated, addInvoice, replaceInvoice, deleteInvoice, markPaid } =
    useInvoices();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterState>({ mode: "all" });
  const [formMountKey, setFormMountKey] = useState(0);

  const selected = useMemo(
    () => invoices.find((i) => i.id === selectedId) ?? null,
    [invoices, selectedId],
  );

  const filtered = useMemo(() => {
    if (statusFilter.mode === "all") return invoices;
    if (statusFilter.statuses.size === 0) return [];
    return invoices.filter((inv) => statusFilter.statuses.has(inv.status));
  }, [invoices, statusFilter]);

  const setFilterAll = () => {
    setStatusFilter({ mode: "all" });
  };

  const toggleStatus = (s: InvoiceStatus) => {
    setStatusFilter((prev) => {
      if (prev.mode === "all") {
        return { mode: "statuses", statuses: new Set<InvoiceStatus>([s]) };
      }
      const next = new Set(prev.statuses);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      if (next.size === 0) return { mode: "all" };
      return { mode: "statuses", statuses: next };
    });
  };

  const startNewInvoice = () => {
    const id = generateInvoiceId(invoices.map((i) => i.id));
    setSelectedId(null);
    setEditingInvoice({
      id,
      clientName: "",
      clientEmail: "",
      clientStreet: "",
      clientCity: "",
      clientPostCode: "",
      clientCountry: "",
      senderStreet: "19 Union Terrace",
      senderCity: "London",
      senderPostCode: "E1 3EZ",
      senderCountry: "United Kingdom",
      invoiceDate: new Date().toISOString().slice(0, 10),
      paymentTermsDays: 30,
      description: "",
      items: [],
      status: "Draft",
      createdAt: new Date().toISOString(),
    });
    setFormMode("create");
    setFormMountKey((k) => k + 1);
    setFormOpen(true);
  };

  const openEdit = (inv: Invoice) => {
    const latest = invoices.find((i) => i.id === inv.id) ?? inv;
    setEditingInvoice(latest);
    setFormMode("edit");
    setFormMountKey((k) => k + 1);
    setFormOpen(true);
  };

  const handleFormSave = (inv: Invoice) => {
    if (formMode === "create") {
      addInvoice(inv);
    } else {
      replaceInvoice(inv);
    }
    setFormOpen(false);
    setEditingInvoice(null);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteInvoice(deleteId);
      if (selectedId === deleteId) setSelectedId(null);
    }
    setDeleteId(null);
  };

  const dueLabel = (inv: Invoice) => {
    const due = new Date(inv.invoiceDate);
    due.setDate(due.getDate() + inv.paymentTermsDays);
    return formatDisplayDate(due.toISOString().slice(0, 10));
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#F8F8FB] text-[#0C0E16] dark:bg-[#141625] dark:text-white md:flex-row">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center px-4 py-12 text-[#888EB0] dark:text-slate-400">
          Loading invoices…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8F8FB] text-[#0C0E16] dark:bg-[#141625] dark:text-white md:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {selected && !formOpen ? (
          <InvoiceDetail
            invoice={selected}
            onBack={() => setSelectedId(null)}
            onEdit={() => openEdit(selected)}
            onDelete={() => setDeleteId(selected.id)}
            onMarkPaid={() => markPaid(selected.id)}
          />
        ) : (
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-16">
            <header className="mb-6 flex flex-row items-center justify-between gap-2 sm:mb-10 md:mb-16 md:items-start md:justify-between">
              <h1 className="min-w-0 truncate text-lg font-[500] text-[#0C0E16] dark:text-white sm:text-2xl md:text-3xl">
                <span className="flex items-center gap-2">Invoices</span>

                <span className="text-[#888EB0] dark:text-slate-400 text-[13px] md:hidden ">
                  <span>
                    {filtered.length}
                  </span>
                  {filtered.length === 1 ? " invoice" : " invoices"}
                </span>

                <p className="mb-6 hidden text-sm text-[#888EB0] dark:text-slate-400 md:mb-10 md:block">
                  {statusFilter.mode === "all"
                    ? `There are ${invoices.length} total invoices`
                    : filtered.length > 0
                      ? `Showing ${filtered.length} of ${invoices.length} invoices (filtered)`
                      : "No invoices match the selected filters"}
                </p>
              </h1>



              <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-8">
                <InvoiceStatusFilter
                  isOpen={filterOpen}
                  onOpenChange={setFilterOpen}
                  filter={statusFilter}
                  onSelectAll={setFilterAll}
                  onToggleStatus={toggleStatus}
                />
                <button
                  type="button"
                  onClick={startNewInvoice}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#7C5DFA] px-3 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#9277FF] sm:gap-3 sm:px-4 sm:py-3 sm:text-base"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm text-[#7C5DFA] sm:h-8 sm:w-8">
                    +
                  </span>
                  <span className="hidden sm:inline">New Invoice</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            </header>

            <div className="flex flex-col gap-3 sm:gap-4">
              {filtered.length === 0 ? (
                <div className="bg-transparent rounded-lg p-10 text-center flex items-center justify-center">
                  <img
                    src="/fallback.svg"
                    alt="Empty state"
                    width={300}
                    height={400}
                    className="mx-auto max-w-full h-auto"
                  />
                </div>
              ) : (
                filtered.map((invoice) => (
                  <button
                    key={invoice.id}
                    type="button"
                    onClick={() => setSelectedId(invoice.id)}
                    className="text-left w-full bg-white dark:bg-[#1E2139] p-4 md:p-6 rounded-lg border-0  transition-all flex flex-col md:flex-row md:items-center sm:justify-between gap-4 cursor-pointer border-[2px] border-[transparent] group hover:border-[#7C5DFA] hover:border-[2px] dark:hover:border-[#9277FF] transition-all transform duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-20 min-w-0 w-full">

                      <div className="flex w-full md:w-auto justify-between gap-2">
                      <span className="font-[700] text-[#0C0E16] dark:text-white shrink-0">
                        <span className="text-[#888EB0] dark:text-slate-500">#</span>
                        {invoice.id}
                      </span>

                        <span className="text-[#858BB2] dark:text-slate-300 truncate md:hidden">
                          {invoice.clientName || "Untitled client"}
                        </span>
                      </div>

                      <span className="text-[#888EB0] dark:text-slate-400 text-sm shrink-0 mt-4 md:mt-0 font-[500]">
                        Due {dueLabel(invoice)}
                      </span>

                      <span className="text-[#858BB2] dark:text-slate-300  hidden md:block font-[500]">
                          {invoice.clientName || "Untitled client"}
                      </span>

                    </div>
                    <div className="flex flex-row items-center justify-between md:justify-end gap-4 md:gap-8 shrink-0">
                      <span className="font-[700] text-lg text-[#0C0E16] dark:text-white">
                        {formatMoney(invoiceTotal(invoice.items))}
                      </span>
                      <StatusBadge
                        status={invoice.status}
                        className="w-28 justify-center py-2.5 sm:py-3 text-sm"
                      />
                      <span className="text-[#7C5DFA] group-hover:translate-x-0.5 transition-transform hidden md:inline">
                        ❯
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </main>
        )}
      </div>

      {formOpen && editingInvoice ? (
        <InvoiceForm
          formKey={formMountKey}
          onClose={() => {
            setFormOpen(false);
            setEditingInvoice(null);
          }}
          mode={formMode}
          initialInvoice={editingInvoice}
          onSave={handleFormSave}
        />
      ) : null}

      <DeleteModal
        isOpen={deleteId !== null}
        invoiceId={deleteId ?? ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
