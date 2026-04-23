import { useState, useRef, useEffect } from "react";

export default function DatePicker({
  value,
  onChange,
  error,
}: {
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplay = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay(); // 0 = Sunday

  const prevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const nextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // Sunday = 0

  // Adjust so Monday = 0
  const startOffset = (firstDay + 6) % 7;

  const monthName = viewDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (day: number) =>
    value &&
    day === value.getDate() &&
    month === value.getMonth() &&
    year === value.getFullYear();

  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

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
        <span className={value ? "text-[#0C0E16] dark:text-white" : "text-[#888EB0] dark:text-slate-400"}>
          {formatDisplay(value)}
        </span>
        {/* Calendar icon */}
        <svg
          className="w-4 h-4 text-[#7C5DFA] dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {/* Calendar panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white dark:bg-[#1E2139] rounded-lg p-6 border border-[#DFE3FA] dark:border-[#252945]">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={prevMonth}
              className="cursor-pointer p-1 text-[#7C5DFA] transition-colors hover:text-[#7C5DFA] dark:text-white dark:hover:text-[#9277FF]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-bold text-[#0C0E16] dark:text-white">{monthName}</span>
            <button
              type="button"
              onClick={nextMonth}
              className="cursor-pointer p-1 text-[#7C5DFA] opacity-100 transition-opacity hover:opacity-70 dark:text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-3">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-[#888EB0] dark:text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-2">
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - startOffset + 1;
              const isValid = dayNum >= 1 && dayNum <= daysInMonth;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={!isValid}
                  onClick={() => {
                    if (!isValid) return;
                    onChange(new Date(year, month, dayNum));
                    setOpen(false);
                  }}
                  className={`
                    mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors
                    ${!isValid ? "invisible" : "cursor-pointer"}
                    ${isSelected(dayNum) ? "bg-[#7C5DFA] text-white dark:text-white" : ""}
                    ${isToday(dayNum) && !isSelected(dayNum) ? "text-[#7C5DFA] dark:text-white" : ""}
                    ${isValid && !isSelected(dayNum) && !isToday(dayNum) ? "text-[#0C0E16] dark:text-white hover:text-[#7C5DFA]" : ""}
                  `}
                >
                  {isValid ? dayNum : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}