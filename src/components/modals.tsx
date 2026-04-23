import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DeleteModalProps = {
  isOpen: boolean;
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({
  isOpen,
  invoiceId,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    prevActive.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      prevActive.current?.focus?.();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
        className="w-full max-w-[480px] cursor-default rounded-lg border border-[#DFE3FA]/30 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-[#1E2139] sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-modal-title"
          className="text-2xl font-bold mb-4 text-[#0C0E16] dark:text-white"
        >
          Confirm Deletion
        </h2>
        <p
          id="delete-modal-desc"
          className="text-[#888EB0] dark:text-slate-400 mb-8 leading-relaxed"
        >
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full bg-[#F9FAFE] px-6 py-4 font-bold text-[#7E88C3] transition-colors hover:bg-[#DFE3FA] dark:bg-[#252945] dark:text-slate-300 dark:hover:bg-[#2a3154]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-[#EC5757] px-6 py-4 font-bold text-white transition-colors hover:bg-[#FF9797]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
