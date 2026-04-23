export type InvoiceStatus = "Draft" | "Pending" | "Paid";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  clientStreet: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;
  senderStreet: string;
  senderCity: string;
  senderPostCode: string;
  senderCountry: string;
  invoiceDate: string;
  paymentTermsDays: number;
  description: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  createdAt: string;
}
