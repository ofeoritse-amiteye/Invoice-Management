import { InvoiceProvider } from "@/src/context/InvoiceContext";
import { ThemeProvider } from "@/src/context/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <InvoiceProvider>{children}</InvoiceProvider>
    </ThemeProvider>
  );
}
