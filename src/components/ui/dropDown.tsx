import { useState, useRef, useEffect } from "react";

const paymentOptions = [
  { label: "Net 1 Day", value: "1" },
  { label: "Net 7 Days", value: "7" },
  { label: "Net 14 Days", value: "14" },
  { label: "Net 30 Days", value: "30" },
];

export default function PaymentTermsDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = paymentOptions.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-5 py-4 rounded-lg border bg-white dark:bg-[#1E2139] dark:text-white text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C5DFA]
          ${error ? "border-red-500" : "border-[#DFE3FA] dark:border-[#252945] hover:border-[#7C5DFA]"}
          ${open ? "border-[#7C5DFA]" : ""}
        `}
      >
        <span className={selected ? "text-[#0C0E16] dark:text-white" : "text-[#888EB0] dark:text-slate-400"}>
          {selected ? selected.label : "Select payment terms"}
        </span>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-[#7C5DFA] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul className="absolute z-50 mt-2 w-full bg-white dark:bg-[#1E2139] rounded-lg overflow-hidden border border-[#DFE3FA] dark:border-[#252945]">
          {paymentOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`px-6 py-4 text-sm font-bold cursor-pointer transition-colors
                ${value === option.value ? "text-[#7C5DFA] dark:text-white" : "text-[#0C0E16] dark:text-white hover:text-[#7C5DFA] dark:hover:text-[#9277FF]"}
                ${index !== paymentOptions.length - 1 ? "border-b border-[#DFE3FA] dark:border-[#252945]" : ""}
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}