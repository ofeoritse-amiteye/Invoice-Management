import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/src/types/invoice";
import { formatMoney } from "@/src/lib/format";
import { newItemId } from "@/src/lib/id";
import { ChevronLeft, Trash2 } from "lucide-react";
import PaymentTermsDropdown from "./ui/dropDown";
import DatePicker from "./ui/datePicker";

type FormRow = {
  id: string;
  name: string;
  quantity: string;
  price: string;
};

export type InvoiceFormProps = {
  onClose: () => void;
  mode: "create" | "edit";
  initialInvoice: Invoice;
  onSave: (invoice: Invoice) => void;
};

function emailValid(value: string): boolean {
  if (!value.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function rowsToItems(rows: FormRow[]): InvoiceItem[] {
  return rows.map((r) => ({
    id: r.id,
    name: r.name.trim(),
    quantity: Number(r.quantity),
    price: Number(r.price),
  }));
}

function itemsToRows(items: InvoiceItem[]): FormRow[] {
  return items.map((i) => ({
    id: i.id,
    name: i.name,
    quantity: String(i.quantity),
    price: String(i.price),
  }));
}

function InvoiceFormLoaded({
  onClose,
  mode,
  initialInvoice,
  onSave,
}: InvoiceFormProps) {
  const [clientName, setClientName] = useState(() => initialInvoice.clientName);
  const [clientEmail, setClientEmail] = useState(() => initialInvoice.clientEmail);
  const [clientStreet, setClientStreet] = useState(() => initialInvoice.clientStreet);
  const [clientCity, setClientCity] = useState(() => initialInvoice.clientCity);
  const [clientPostCode, setClientPostCode] = useState(() => initialInvoice.clientPostCode);
  const [clientCountry, setClientCountry] = useState(() => initialInvoice.clientCountry);
  const [senderStreet, setSenderStreet] = useState(() => initialInvoice.senderStreet);
  const [senderCity, setSenderCity] = useState(() => initialInvoice.senderCity);
  const [senderPostCode, setSenderPostCode] = useState(() => initialInvoice.senderPostCode);
  const [senderCountry, setSenderCountry] = useState(() => initialInvoice.senderCountry);
  const [invoiceDate, setInvoiceDate] = useState(() => initialInvoice.invoiceDate);
  const [paymentTermsDays, setPaymentTermsDays] = useState(() =>
    String(initialInvoice.paymentTermsDays),
  );
  const [description, setDescription] = useState(() => initialInvoice.description);
  const [rows, setRows] = useState<FormRow[]>(() =>
    initialInvoice.items.length
      ? itemsToRows(initialInvoice.items)
      : [{ id: newItemId(), name: "", quantity: "1", price: "0" }],
  );
  const [originalStatus] = useState<InvoiceStatus>(() => initialInvoice.status);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const invoiceId = initialInvoice.id;
  const createdAt = initialInvoice.createdAt;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const addRow = () => {
    setRows((r) => [...r, { id: newItemId(), name: "", quantity: "1", price: "0" }]);
  };

  const removeRow = (id: string) => {
    setRows((r) => (r.length <= 1 ? r : r.filter((row) => row.id !== id)));
  };

  const updateRow = (id: string, patch: Partial<FormRow>) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const validateDraft = (): boolean => {
    const next: Record<string, string> = {};
    if (clientEmail.trim() && !emailValid(clientEmail)) {
      next.clientEmail = "Enter a valid email or leave blank for drafts.";
    }
    rows.forEach((row) => {
      if (row.name.trim()) {
        const q = Number(row.quantity);
        const p = Number(row.price);
        if (!(q > 0)) next[`qty_${row.id}`] = "Quantity must be greater than 0.";
        if (!(p > 0)) next[`price_${row.id}`] = "Price must be greater than 0.";
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /** Save & Send / Save changes: every field required, valid email, positive qty & price on each line. */
  const validateSend = (): boolean => {
    const next: Record<string, string> = {};
    const req = (key: string, value: string, label: string) => {
      if (!value.trim()) next[key] = `${label} is required.`;
    };

    req("senderStreet", senderStreet, "Street address");
    req("senderCity", senderCity, "City");
    req("senderPostCode", senderPostCode, "Post code");
    req("senderCountry", senderCountry, "Country");

    req("clientName", clientName, "Client name");
    if (!clientEmail.trim()) {
      next.clientEmail = "Client email is required.";
    } else if (!emailValid(clientEmail)) {
      next.clientEmail = "Enter a valid email address.";
    }
    req("clientStreet", clientStreet, "Client street address");
    req("clientCity", clientCity, "Client city");
    req("clientPostCode", clientPostCode, "Client post code");
    req("clientCountry", clientCountry, "Client country");

    if (!invoiceDate.trim()) {
      next.invoiceDate = "Invoice date is required.";
    }
    const terms = Number(paymentTermsDays);
    if (!Number.isFinite(terms) || terms < 1) {
      next.paymentTerms = "Select a payment term.";
    }

    req("description", description, "Project / description");

    if (!rows.length) {
      next.items = "Add at least one invoice line.";
    }
    rows.forEach((row) => {
      if (!row.name.trim()) next[`name_${row.id}`] = "Item name is required.";
      const q = Number(row.quantity);
      const p = Number(row.price);
      if (!(q > 0)) next[`qty_${row.id}`] = "Quantity must be greater than 0.";
      if (!(p > 0)) next[`price_${row.id}`] = "Price must be greater than 0.";
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildInvoice = (status: InvoiceStatus, itemList: InvoiceItem[]): Invoice => ({
    id: invoiceId,
    createdAt,
    status,
    clientName: clientName.trim(),
    clientEmail: clientEmail.trim(),
    clientStreet: clientStreet.trim(),
    clientCity: clientCity.trim(),
    clientPostCode: clientPostCode.trim(),
    clientCountry: clientCountry.trim(),
    senderStreet: senderStreet.trim(),
    senderCity: senderCity.trim(),
    senderPostCode: senderPostCode.trim(),
    senderCountry: senderCountry.trim(),
    invoiceDate,
    paymentTermsDays: Math.max(0, Number(paymentTermsDays) || 0),
    description: description.trim(),
    items: itemList,
  });

  const handleSaveDraft = () => {
    if (!validateDraft()) return;
    const itemList = rowsToItems(rows).filter((i) => i.name.trim());
    onSave(buildInvoice("Draft", itemList));
  };

  const handleSaveSend = () => {
    if (!validateSend()) return;
    onSave(buildInvoice("Pending", rowsToItems(rows)));
  };

  /** Edit mode: full validation, keep Draft / Pending / Paid as-is. */
  const handleSaveChanges = () => {
    if (!validateSend()) return;
    onSave(buildInvoice(originalStatus, rowsToItems(rows)));
  };

  const inputClass = (err?: string) =>
    `w-full border rounded-md p-3 font-bold focus:border-[#7C5DFA] outline-none bg-white dark:bg-[#1E2139] text-[#0C0E16] dark:text-white dark:border-slate-600 ${
      err ? "border-red-500 ring-1 ring-red-500/30" : "border-[#DFE3FA]"
    }`;

  return (
    <>
      <div
        role="presentation"
        className="fixed inset-0 z-30 hidden cursor-pointer bg-black/20 dark:bg-black/40 md:block"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "tween", duration: 0.28 }}
        className="fixed inset-0 z-[100] flex max-h-[100dvh] max-w-none flex-col bg-white dark:bg-[#141625] md:inset-y-0 md:left-[100px] md:right-auto md:z-50 md:h-screen md:max-h-none md:max-w-[700px] lg:left-[103px] md:rounded-r-3xl md:border-r md:border-[#DFE3FA]/50 md:shadow-2xl dark:md:border-slate-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-form-title"
      >
        <div className="flex shrink-0 items-center border-0 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#141625] md:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label={mode === "edit" ? "Cancel editing" : "Close new invoice form"}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm font-bold font-extrabold text-[#0C0E16] transition-colors hover:bg-[#F9FAFE] dark:text-white dark:hover:bg-[#252945]"
          >
            <ChevronLeft className="h-5 w-5 shrink-0 text-[#7C5DFA]" aria-hidden />
            {mode === "edit" ? "Cancel" : "Go back"}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-4 sm:px-6 md:px-12 md:py-12">
        <h2
          id="invoice-form-title"
          className="mb-6 text-xl font-bold text-[#0C0E16] dark:text-white md:mb-8 md:text-2xl"
        >
          {mode === "create" ? "New Invoice" : `Edit #${invoiceId}`}
        </h2>

        <section className="space-y-6">
          <p className="text-[#7C5DFA] font-bold">Bill From</p>

          <div className="sm:col-span-3 w-full">
              <label htmlFor="senderStreet" className="text-[#7E88C3] text-sm mb-2 block">
                Street Address
              </label>
              <input
                id="senderStreet"
                type="text"
                value={senderStreet}
                onChange={(e) => setSenderStreet(e.target.value)}
                className={inputClass(errors.senderStreet)}
                aria-invalid={!!errors.senderStreet}
                aria-describedby={errors.senderStreet ? "err-senderStreet" : undefined}
              />
              {errors.senderStreet ? (
                <p id="err-senderStreet" className="text-red-600 text-sm mt-1">
                  {errors.senderStreet}
                </p>
              ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            <div className="grid grid-cols-2 md:grid-cols-0 gap-4 sm:gap-6">

            <div className="w-full">
              <label htmlFor="senderCity" className="text-[#7E88C3] text-sm mb-2 block">
                City
              </label>
              <input
                id="senderCity"
                type="text"
                value={senderCity}
                onChange={(e) => setSenderCity(e.target.value)}
                className={inputClass(errors.senderCity)}
                aria-invalid={!!errors.senderCity}
                aria-describedby={errors.senderCity ? "err-senderCity" : undefined}
              />
              {errors.senderCity ? (
                <p id="err-senderCity" className="text-red-600 text-sm mt-1">
                  {errors.senderCity}
                </p>
              ) : null}
            </div>

            <div className="w-full">
              <label htmlFor="senderPostCode" className="text-[#7E88C3] text-sm mb-2 block">
                Post Code
              </label>
              <input
                id="senderPostCode"
                type="text"
                value={senderPostCode}
                onChange={(e) => setSenderPostCode(e.target.value)}
                className={inputClass(errors.senderPostCode)}
                aria-invalid={!!errors.senderPostCode}
                aria-describedby={errors.senderPostCode ? "err-senderPostCode" : undefined}
              />
              {errors.senderPostCode ? (
                <p id="err-senderPostCode" className="text-red-600 text-sm mt-1">
                  {errors.senderPostCode}
                </p>
              ) : null}
            </div>

            </div>


            <div className="w-full">
              <label htmlFor="senderCountry" className="text-[#7E88C3] text-sm mb-2 block">
                Country
              </label>
              <input
                id="senderCountry"
                type="text"
                value={senderCountry}
                onChange={(e) => setSenderCountry(e.target.value)}
                className={inputClass(errors.senderCountry)}
                aria-invalid={!!errors.senderCountry}
                aria-describedby={errors.senderCountry ? "err-senderCountry" : undefined}
              />
              {errors.senderCountry ? (
                <p id="err-senderCountry" className="text-red-600 text-sm mt-1">
                  {errors.senderCountry}
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-[#7C5DFA] font-bold mt-10">Bill To</p>

          <div className=" gap-4 space-y-4 sm:gap-6">
            <div>
              <label htmlFor="clientName" className=" text-sm mb-2 block flex justify-between">
                <p className={`text-[#7E88C3] ${errors.clientName ? "text-red-600" : ""}`}>Client&apos;s Name</p>
                {errors.clientName ? (
                <p id="err-clientName" className="text-red-600 text-sm mt-1">
                  {errors.clientName}
                </p>
              ) : null}
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={inputClass(errors.clientName)}
                aria-invalid={!!errors.clientName}
                aria-describedby={errors.clientName ? "err-clientName" : undefined}
              />
            </div>

            <div>
              <label htmlFor="clientEmail" className="text-[#7E88C3] text-sm mb-2 block flex justify-between">
                <p className={`text-[#7E88C3] ${errors.clientEmail ? "text-red-600" : ""}`}>Client&apos;s Email</p>
                {errors.clientEmail ? (
                  <p id="err-clientEmail" className="text-red-600 text-sm mt-1">
                    {errors.clientEmail}
                  </p>
                ) : null}
              </label>
              <input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className={inputClass(errors.clientEmail)}
                aria-invalid={!!errors.clientEmail}
                aria-describedby={errors.clientEmail ? "err-clientEmail" : undefined}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="clientStreet" className="text-[#7E88C3] text-sm mb-2 block flex justify-between">
                <p className={`text-[#7E88C3] ${errors.clientStreet ? "text-red-600" : ""}`}>Street Address</p>
                {errors.clientStreet ? (
                  <p id="err-clientStreet" className="text-red-600 text-sm mt-1">
                    {errors.clientStreet}
                  </p>
                ) : null}
              </label>
              <input
                id="clientStreet"
                type="text"
                value={clientStreet}
                onChange={(e) => setClientStreet(e.target.value)}
                className={inputClass(errors.clientStreet)}
                aria-invalid={!!errors.clientStreet}
                aria-describedby={errors.clientStreet ? "err-clientStreet" : undefined}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label htmlFor="clientCity" className="text-[#7E88C3] text-sm mb-2 block">
                  City
                </label>
                <input
                  id="clientCity"
                  type="text"
                  value={clientCity}
                  onChange={(e) => setClientCity(e.target.value)}
                  className={inputClass(errors.clientCity)}
                  aria-invalid={!!errors.clientCity}
                  aria-describedby={errors.clientCity ? "err-clientCity" : undefined}
                />
                {errors.clientCity ? (
                  <p id="err-clientCity" className="text-red-600 text-sm mt-1">
                    {errors.clientCity}
                  </p>
                ) : null}
              </div>

              <div>

                <label htmlFor="clientPostCode" className="text-[#7E88C3] text-sm mb-2 block">
                  Post Code
                </label>
                <input
                  id="clientPostCode"
                  type="text"
                  value={clientPostCode}
                  onChange={(e) => setClientPostCode(e.target.value)}
                  className={inputClass(errors.clientPostCode)}
                  aria-invalid={!!errors.clientPostCode}
                  aria-describedby={errors.clientPostCode ? "err-clientPostCode" : undefined}
                />
                {errors.clientPostCode ? (
                  <p id="err-clientPostCode" className="text-red-600 text-sm mt-1">
                    {errors.clientPostCode}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="clientCountry" className="text-[#7E88C3] text-sm mb-2 block">
                  Country
                </label>
                <input
                  id="clientCountry"
                  type="text"
                  value={clientCountry}
                  onChange={(e) => setClientCountry(e.target.value)}
                  className={inputClass(errors.clientCountry)}
                  aria-invalid={!!errors.clientCountry}
                  aria-describedby={errors.clientCountry ? "err-clientCountry" : undefined}
                />
                {errors.clientCountry ? (
                  <p id="err-clientCountry" className="text-red-600 text-sm mt-1">
                    {errors.clientCountry}
                  </p>
                ) : null}
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="invoiceDate" className="text-[#7E88C3] text-sm mb-2 block">
                Invoice Date
              </label>
              <DatePicker
                value={new Date(invoiceDate)}
                onChange={(date: Date) => setInvoiceDate(date.toISOString())}
                error={errors.invoiceDate}
              />
              {errors.invoiceDate ? (
                <p id="err-invoiceDate" className="text-red-600 text-sm mt-1">
                  {errors.invoiceDate}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="paymentTerms" className="text-[#7E88C3] text-sm mb-2 block">
                Payment Terms (days)
              </label>
              <PaymentTermsDropdown
                value={paymentTermsDays}
                onChange={(value: string) => setPaymentTermsDays(value)}
                error={errors.paymentTerms}
              />
              {errors.paymentTerms ? (
                <p id="err-paymentTerms" className="text-red-600 text-sm mt-1">
                  {errors.paymentTerms}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-[#7E88C3] text-sm mb-2 block">
              Project / Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass(errors.description)}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "err-description" : undefined}
            />
            {errors.description ? (
              <p id="err-description" className="text-red-600 text-sm mt-1">
                {errors.description}
              </p>
            ) : null}
          </div>

          <h3 className="text-[#777F98] dark:text-slate-400 text-xl font-bold mt-12 mb-4">
            Item List
          </h3>
          {errors.items ? (
            <p className="text-red-600 text-sm mb-2">{errors.items}</p>
          ) : null}
          <div className="space-y-4">
            <div className="hidden sm:grid grid-cols-12 gap-4 items-center text-[#7E88C3] text-sm font-bold">
              <div className="col-span-3">Item Name</div>
              <div className="col-span-3 ">Qty.</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1" />
            </div>
            {rows.map((row) => {
              const q = Number(row.quantity) || 0;
              const p = Number(row.price) || 0;
              const line = q * p;
              return (
                <div
                  key={row.id}
                  className=" flex flex-row gap-4 justify-between border border-[#DFE3FA] dark:border-slate-700 rounded-lg p-4 sm:border-0 sm:p-0"
                >
                  <div className="">
                    <label className="text-[#7E88C3] text-xs sm:hidden block mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, { name: e.target.value })}
                      className={inputClass(errors[`name_${row.id}`])}
                      aria-invalid={!!errors[`name_${row.id}`]}
                    />
                    {errors[`name_${row.id}`] ? (
                      <p className="text-red-600 text-xs mt-1">{errors[`name_${row.id}`]}</p>
                    ) : null}
                  </div>

                  <div className="">
                    <label className="text-[#7E88C3] text-xs sm:hidden block mb-1">Qty.</label>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, { quantity: e.target.value })}
                      className={inputClass(errors[`qty_${row.id}`])}
                    />
                    {errors[`qty_${row.id}`] ? (
                      <p className="text-red-600 text-xs mt-1">{errors[`qty_${row.id}`]}</p>
                    ) : null}
                  </div>

                  <div className="">
                    <label className="text-[#7E88C3] text-xs sm:hidden block mb-1">Price</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={row.price}
                      onChange={(e) => updateRow(row.id, { price: e.target.value })}
                      className={inputClass(errors[`price_${row.id}`])} 
                      aria-invalid={!!errors[`price_${row.id}`]}
                    />
                    {errors[`price_${row.id}`] ? (
                      <p className="text-red-600 text-xs mt-1">{errors[`price_${row.id}`]}</p>
                    ) : null}
                  </div>

                  <div className=" font-bold text-[#0C0E16] dark:text-white  w-[40%]">
                    <span className="sm:hidden text-[#7E88C3] text-xs block mb-1 text-center">
                      Total
                    </span>

                    <div className="text-center mt-4 text-[#888EB0] text-[15px] sm:text-lg">
                      {formatMoney(line)}
                    </div>

                  </div>

                  <div className="sm:col-span-1 flex sm:justify-end sm:pt-2">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="cursor-pointer text-[#888EB0] text-sm font-bold transition-colors hover:bg-red-50 hover:text-[#EC5757] dark:hover:bg-red-900/20 px-2 py-1 rounded-md"
                      aria-label="Remove line item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addRow}
              className="mt-4 w-full cursor-pointer rounded-full bg-[#F9FAFE] py-4 font-bold text-[#7E88C3] transition-colors hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-slate-300 dark:hover:bg-[#2a3154]"
            >
              + Add New Item
            </button>
          </div>
        </section>

        <div
          className={
            mode === "edit"
              ? "mt-12 flex justify-end gap-3 border-t border-[#DFE3FA] pt-8 dark:border-slate-700"
              : "mt-12 flex justify-between gap-3 border-t border-[#DFE3FA] pt-8 dark:border-slate-700 sm:flex-row sm:items-center sm:gap-2"
          }
        >
          {mode === "edit" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full bg-[#F9FAFE] px-6 py-4 font-bold text-[#7E88C3] transition-colors hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-slate-300 dark:hover:bg-[#2a3154]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="cursor-pointer rounded-full bg-[#7C5DFA] px-6 py-4 font-bold text-white transition-colors hover:bg-[#9277FF]"
              >
                Save changes
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full bg-[#F9FAFE] px-3 py-4 font-bold text-[#7E88C3] transition-colors hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-slate-300 dark:hover:bg-[#2a3154] sm:px-6"
              >
                Discard
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="cursor-pointer rounded-full bg-[#373B53] px-6 py-4 text-[15px] font-bold text-[#DFE3FA] transition-opacity hover:opacity-90"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handleSaveSend}
                  className="cursor-pointer rounded-full bg-[#7C5DFA] px-6 py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#9277FF]"
                >
                  Save & Send
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      </motion.div>
    </>
  );
}

export default function InvoiceForm(props: {
  onClose: () => void;
  mode: "create" | "edit";
  initialInvoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
  formKey: number;
}) {
  const { initialInvoice, formKey, ...rest } = props;
  if (!initialInvoice) return null;
  return <InvoiceFormLoaded key={formKey} initialInvoice={initialInvoice} {...rest} />;
}
