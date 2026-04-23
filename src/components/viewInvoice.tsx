import type { Invoice } from "@/src/types/invoice";
import { addDays, formatDisplayDate, formatMoney, invoiceTotal } from "@/src/lib/format";
import StatusBadge from "@/src/components/StatusBadge";

export type InvoiceDetailProps = {
  invoice: Invoice;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkPaid: () => void;
};

export default function InvoiceDetail({
  invoice,
  onBack,
  onEdit,
  onDelete,
  onMarkPaid,
}: InvoiceDetailProps) {
  const dueIso = addDays(invoice.invoiceDate, invoice.paymentTermsDays);
  const total = invoiceTotal(invoice.items);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-12 max-h-[100svh] overflow-y-auto no-scrollbar">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex cursor-pointer items-center gap-4 font-bold text-[#0C0E16] transition-colors hover:text-[#7C5DFA] dark:text-white dark:hover:text-[#9277FF]"
      >
        <span className="text-[#7C5DFA]" aria-hidden>
          ❮
        </span>{" "}
        Go back
      </button>

      <header className="mb-6 rounded-lg border-0 bg-white p-4 shadow-lg dark:bg-[#1E2139] md:p-6">
        <div className="flex items-center justify-between gap-4 custom:hidden">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#858BB2] dark:text-slate-400">
              Status
            </p>

            <StatusBadge status={invoice.status} compact />
        </div>

        <div className="hidden custom:flex custom:w-full custom:flex-row custom:items-center custom:justify-between custom:gap-4">
          <div className="flex flex-row items-center gap-4">
            <span className="text-[#858BB2] dark:text-slate-400">Status</span>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="cursor-pointer rounded-full bg-[#F9FAFE] px-6 py-3 font-bold text-[#7E88C3] transition-colors hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-slate-300 dark:hover:bg-[#2a3154]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer rounded-full bg-[#EC5757] px-6 py-3 font-bold text-white transition-colors hover:bg-[#FF9797]"
            >
              Delete
            </button>
            {invoice.status === "Pending" ? (
              <button
                type="button"
                onClick={onMarkPaid}
                className="cursor-pointer rounded-full bg-[#7C5DFA] px-6 py-3 font-bold text-white transition-colors hover:bg-[#9277FF]"
              >
                Mark as Paid
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-[#1E2139] p-6 sm:p-12 rounded-lg shadow-lg border-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-xl font-bold text-[#0C0E16] dark:text-white">
              #{invoice.id}
            </h1>
            <p className="text-[#7E88C3] dark:text-slate-400 font-[500]">
              {invoice.description || "—"}
            </p>
          </div>
          <address className="text-[#7E88C3] dark:text-slate-400 sm:text-right not-italic text-sm leading-relaxed font-[500]">
            {invoice.senderStreet}
            <br />
            {invoice.senderCity}
            <br />
            {invoice.senderPostCode}
            <br />
            {invoice.senderCountry}
          </address>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          
          <div>
            <p className="text-[#7E88C3] dark:text-slate-400 mb-3">Invoice Date</p>
            <p className="font-bold text-lg text-[#0C0E16] dark:text-white">
              {formatDisplayDate(invoice.invoiceDate)}
            </p>
            <p className="text-[#7E88C3] dark:text-slate-400 text-sm mt-4 mb-1">
              Payment date
            </p>
            <p className="font-bold text-[#0C0E16] dark:text-white">
              {formatDisplayDate(dueIso)}
            </p>
          </div>

          <div>
            <p className="text-[#7E88C3] dark:text-slate-400 mb-3">Bill To</p>
            <p className="font-bold text-lg text-[#0C0E16] dark:text-white">
              {invoice.clientName || "Untitled client"}
            </p>
            <address className="text-[#7E88C3] dark:text-slate-400 not-italic text-sm mt-2 leading-relaxed font-[500]">
              {invoice.clientStreet ? (
                <>
                  {invoice.clientStreet}
                  <br />
                </>
              ) : null}
              {invoice.clientCity ? (
                <>
                  {invoice.clientCity}
                  <br />
                </>
              ) : null}
              {invoice.clientPostCode ? (
                <>
                  {invoice.clientPostCode}
                  <br />
                </>
              ) : null}
              {invoice.clientCountry || null}
            </address>
          </div>

          <div>
            <p className="text-[#7E88C3] dark:text-slate-400 mb-3">Sent to</p>
            <p className="font-bold text-lg text-[#0C0E16] dark:text-white  ">
              {invoice.clientEmail || "—"}
            </p>
          </div>
        </div>

        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-6 sm:p-8">
          <div className="grid grid-cols-5 text-[#7E88C3] dark:text-slate-400 text-sm mb-6 gap-2">
            <div className="col-span-2">Item Name</div>
            <div className="text-center">QTY.</div>
            <div className="text-right">Price</div>
            <div className="text-right">Total</div>
          </div>
          {invoice.items.length === 0 ? (
            <p className="text-[#7E88C3] dark:text-slate-400 text-sm">No line items.</p>
          ) : (
            invoice.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 font-bold mb-4 gap-2 text-sm sm:text-base"
              >
                <div className="col-span-2 text-[#0C0E16] dark:text-white break-words">
                  {item.name}
                </div>
                <div className="text-center text-[#7E88C3] dark:text-slate-400">
                  {item.quantity}
                </div>
                <div className="text-right text-[#7E88C3] dark:text-slate-400">
                  {formatMoney(item.price)}
                </div>
                <div className="text-right text-black dark:text-white">
                  {formatMoney(item.quantity * item.price)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#373B53] dark:bg-[#0C0E16] p-6 sm:p-8 rounded-b-lg flex justify-between items-center">
          <p className="text-white text-sm">
            {invoice.status === "Paid" ? "Amount Paid" : "Amount Due"}
          </p>
          <p className="text-white text-2xl sm:text-3xl font-bold">{formatMoney(total)}</p>
        </div>
      </div>

      <footer
        className="mt-4 rounded-lg border border-[#DFE3FA]/40 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-[#1E2139] custom:hidden"
        aria-label="Invoice actions"
      >
        <div className="flex gap-3">
          <div className="flex items-center justify-center gap-2 w-full">
            <button
              type="button"
              onClick={onEdit}
              className="cursor-pointer rounded-full bg-[#F9FAFE] px-4 py-3 text-sm font-bold text-[#7E88C3] transition-colors hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-slate-300 dark:hover:bg-[#2a3154]"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer rounded-full bg-[#EC5757] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#FF9797]"
            >
              Delete
            </button>

            {invoice.status === "Pending" ? (
            <button
              type="button"
              onClick={onMarkPaid}
              className="w-full cursor-pointer rounded-full bg-[#7C5DFA] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#9277FF]"
            >
              Mark as Paid
            </button>
          ) : null}

          </div>
        </div>
      </footer>
    </div>
  );
}
