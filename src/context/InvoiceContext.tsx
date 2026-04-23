import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Invoice } from "@/src/types/invoice";
import { loadInvoices, saveInvoices, seedInvoices } from "@/src/lib/invoices-storage";

type InvoiceContextValue = {
  invoices: Invoice[];
  hydrated: boolean;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  replaceInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markPaid: (id: string) => void;
};

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = loadInvoices();
      setInvoices(stored === null ? seedInvoices() : stored);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveInvoices(invoices);
  }, [invoices, hydrated]);

  const addInvoice = useCallback((invoice: Invoice) => {
    setInvoices((prev) => [invoice, ...prev]);
  }, []);

  const updateInvoice = useCallback((id: string, patch: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...patch } : inv)),
    );
  }, []);

  const replaceInvoice = useCallback((invoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? invoice : inv)),
    );
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  const markPaid = useCallback((id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id && inv.status === "Pending"
          ? { ...inv, status: "Paid" as const }
          : inv,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      invoices,
      hydrated,
      addInvoice,
      updateInvoice,
      replaceInvoice,
      deleteInvoice,
      markPaid,
    }),
    [
      invoices,
      hydrated,
      addInvoice,
      updateInvoice,
      replaceInvoice,
      deleteInvoice,
      markPaid,
    ],
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used within InvoiceProvider");
  return ctx;
}
