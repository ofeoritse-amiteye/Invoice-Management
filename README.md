# Invoice management

React + Vite SPA for creating, editing, and tracking invoices. Data is stored in **localStorage** (`src/lib/invoices-storage.ts`, `InvoiceContext`).

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)).

```bash
npm run build    # production bundle in dist/
npm run preview  # serve dist/
npm run typecheck
```

## Stack

- **React 19**, **TypeScript**, **Vite 7**
- **Tailwind CSS v4** via [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite)
- **League Spartan** from [Google Fonts](https://fonts.google.com/specimen/League+Spartan) (linked in `index.html`, token in `src/globals.css`)

## Project layout

- `src/App.tsx` — root layout + providers
- `src/components/` — UI (dashboard, form, detail, modals, `StatusBadge`, `InvoiceStatusFilter`, etc.)
- `src/context/` — theme + invoices
- `src/lib/` — storage, ids, formatting
- `public/` — static assets (`fallback.svg`, optional `public/images/ME.jpg` for the sidebar avatar)

## Deploy

Any static host that can serve a SPA (Netlify, Vercel static, Cloudflare Pages, S3 + CloudFront). Build output is `dist/`.
