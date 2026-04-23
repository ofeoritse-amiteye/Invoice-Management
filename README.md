# Invoice management

React + Vite SPA for creating, editing, and tracking invoices. Data persists in the browser via **localStorage**.

---

## Setup instructions

Prerequisites: **Node.js** (LTS recommended) and **npm**.

```bash
git clone <your-repo-url>
cd invoice_app
npm install
npm run dev
```

Open the URL printed in the terminal (typically [http://localhost:5173](http://localhost:5173)).

Other scripts:

```bash
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
npm run typecheck  # TypeScript check (no emit)
npm run lint       # ESLint
```

**Optional asset:** the sidebar expects a profile image at `public/images/ME.jpg`. Add that file, or replace the paths in `src/components/sidebar.tsx`.

**Deploy:** build with `npm run build`, then host the `dist/` folder on Netlify, Vercel (static), Cloudflare Pages, or similar. Configure the host for SPA fallback (all routes → `index.html`) if you add client-side routing later.

---

## Architecture explanation

- **Entry:** `index.html` loads `src/main.tsx`, which mounts `<App />` under `#root` and imports global styles (`src/globals.css`).
- **App shell:** `src/App.tsx` wraps the tree in `Providers` (`ThemeProvider` → `InvoiceProvider`) then renders `InvoiceDashboard`.
- **State & data:**
  - **`InvoiceContext`** (`src/context/InvoiceContext.tsx`) holds the invoice list, hydration flag, and mutations (add, replace, delete, mark paid). On first load it reads from storage and can seed demo data when empty.
  - **`ThemeContext`** (`src/context/ThemeContext.tsx`) holds light/dark mode and syncs preference to `localStorage`.
  - **`src/lib/invoices-storage.ts`** serializes/deserializes invoices to a single `localStorage` key; `src/lib/format.ts` and `src/lib/id.ts` handle display formatting and IDs.
- **UI layers:**
  - **`InvoiceDashboard`** — list vs detail vs form orchestration, status filter state, delete modal trigger.
  - **`CreateEdit`** — full-screen/slide-over invoice form; separate validation paths for **draft** vs **save & send**.
  - **`viewInvoice`** — read-only detail view with actions (edit, delete, mark paid when pending).
  - **`InvoiceStatusFilter`** — checkbox filter (All + per-status); **`StatusBadge`** — shared status pill for list and detail.
  - **`modals`** — delete confirmation dialog.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`; dark mode uses a `.dark` class on the document root (see theme context).

Path alias **`@/*`** maps to the project root (see `vite.config.ts` and `tsconfig.json`).

---

## Trade-offs

| Choice | Why | Cost |
|--------|-----|------|
| **localStorage only** | Meets “persist in the browser” with zero backend setup; fast to ship and grade. | No multi-device sync, ~5MB limit, no server-side validation or auth. |
| **Vite + React (no Next.js)** | Matches a strict “React only” deliverable; simple static deploy. | No built-in API routes; any future backend is a separate service. |
| **Client-side validation only** | Immediate feedback; works offline after first load. | Malicious users could bypass the UI (not an issue for a local classroom app). |
| **Stricter validation on “Save & send” than on “Save as draft”** | Drafts can be incomplete; sending implies a complete invoice. | Users must understand two save paths in create mode. |
| **Single-page dashboard** (list/detail/form in one route) | Fewer moving parts than React Router pages for this scope. | URL does not reflect “which invoice” is open (could add hash/query later). |

The brief mentions **IndexedDB** or a **backend** as alternatives; this project intentionally chose **localStorage** for simplicity unless you later add sync or a small API.

---

## Accessibility notes

- **Forms:** Primary fields use `<label htmlFor="…">` paired with matching `id` on inputs; invalid fields set `aria-invalid` and show visible error text.
- **Delete modal:** Uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby` / `aria-describedby`; **Escape** closes the dialog; **Tab** cycles focus between controls inside the dialog; focus returns to the previously focused element on close.
- **Interactive controls:** Theme toggle and main actions use native **`<button type="button">`** where appropriate.
- **Contrast:** Palette follows the Figma-inspired invoice UI with distinct text and surface colors in both light and dark themes; a formal WCAG audit was not run as part of this README—spot-check critical text if compliance must be proven.

Known gaps to improve later: focus management on the invoice **form** panel when it opens, live regions for dynamic filter results, and full keyboard paths through every custom control (e.g. date picker / custom dropdowns).

---

## Improvements beyond requirements

- **Explicit “All” filter** alongside Draft / Pending / Paid, with multi-select semantics (“any selected status”) and an empty state when nothing matches.
- **Reusable `StatusBadge` and `InvoiceStatusFilter`** components instead of inlining status styles and filter markup everywhere.
- **Draft vs send validation:** looser rules when saving a draft; full required-field + email + line-item checks when sending or saving edits that must stay consistent.
- **Theme persistence** in `localStorage` so preference survives reload.
- **TypeScript + ESLint** (including hooks rules) for safer refactors.
- **Vite** for a fast dev server and a straightforward production bundle.

---

## Stack (quick reference)

- **React 19**, **TypeScript**, **Vite 7**
- **Tailwind CSS v4** via [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite)
- **League Spartan** from [Google Fonts](https://fonts.google.com/specimen/League+Spartan) (linked in `index.html`, referenced in `src/globals.css`)

## Project layout (files)

- `src/App.tsx` — root + providers
- `src/components/` — dashboard, form, detail, modals, `StatusBadge`, `InvoiceStatusFilter`, sidebar, UI widgets
- `src/context/` — theme + invoices
- `src/lib/` — storage, ids, formatting
- `public/` — static assets (`fallback.svg`, optional `public/images/ME.jpg`)
