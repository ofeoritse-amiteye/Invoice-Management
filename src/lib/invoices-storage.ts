import type { Invoice } from "@/src/types/invoice";

const STORAGE_KEY = "invoice-mgmt:invoices";

export function loadInvoices(): Invoice[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Invoice[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function seedInvoices(): Invoice[] {
  const now = new Date().toISOString().slice(0, 10);
  return [
    {
      id: "RT3080",
      clientName: "Jensen Huang",
      clientEmail: "jensen@nvidia.com",
      clientStreet: "1 Infinite Loop",
      clientCity: "Cupertino",
      clientPostCode: "CA 95014",
      clientCountry: "United States",
      senderStreet: "19 Union Terrace",
      senderCity: "London",
      senderPostCode: "E1 3EZ",
      senderCountry: "United Kingdom",
      invoiceDate: now,
      paymentTermsDays: 14,
      description: "Re-branding",
      items: [{ id: "seed-rt-1", name: "Brand Guidelines", quantity: 1, price: 1800.9 }],
      status: "Paid",
      createdAt: new Date().toISOString(),
    },
    {
      id: "XM9141",
      clientName: "Alex Grim",
      clientEmail: "alexgrim@mail.com",
      clientStreet: "84 Church Way",
      clientCity: "Bradford",
      clientPostCode: "BD1 9PB",
      clientCountry: "United Kingdom",
      senderStreet: "19 Union Terrace",
      senderCity: "London",
      senderPostCode: "E1 3EZ",
      senderCountry: "United Kingdom",
      invoiceDate: now,
      paymentTermsDays: 30,
      description: "Graphic Design",
      items: [{ id: "seed-xm-1", name: "Banner Design", quantity: 1, price: 156 }],
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "RG0314",
      clientName: "John Morrison",
      clientEmail: "jm@morrison.com",
      clientStreet: "79 Dover Road",
      clientCity: "Southampton",
      clientPostCode: "SO19 7QE",
      clientCountry: "United Kingdom",
      senderStreet: "19 Union Terrace",
      senderCity: "London",
      senderPostCode: "E1 3EZ",
      senderCountry: "United Kingdom",
      invoiceDate: now,
      paymentTermsDays: 7,
      description: "Website Redesign",
      items: [
        { id: "seed-rg-1", name: "UX Review", quantity: 1, price: 12000 },
        { id: "seed-rg-2", name: "Implementation", quantity: 1, price: 2002.33 },
      ],
      status: "Paid",
      createdAt: new Date().toISOString(),
    },
  ];
}
