# Practice Savings Calculator

https://in-housesystems.com/practice-savings-calculator/

Lab savings calculator for dental and orthodontic practices considering in-house appliance production. Compare lab invoices to the full internal cost: materials, labor, scrap, equipment, space, software, utilities, and maintenance.

Open the live URL. Start from Dental, Ortho, or an empty sheet. Edit the mix and overhead. Switch month / year. Figures stay in this browser; nothing is sent to a server.

## What's the app vs leftover

| What | What it is |
|---|---|
| This page (`/practice-savings-calculator/`) | The live calculator |
| Company site `/calculator.html` | Redirects here. Old bookmarks still work |
| `src/` | Source. Edit here |
| Root `index.html` / `assets/` | GitHub Pages snapshot (generated). Refresh with `npm run pages` |
| `archive/previous-html/` | Previous single-file calculator. Not live |

Login, server, and home-screen install leftovers were removed. This calculator never used them.

## Run locally

```bash
npm install
npm run dev
```

Then open the address printed (port 8080).

```bash
npm test
npm run typecheck
npm run pages
```

`npm run pages` builds and copies the static files to the repo root for GitHub Pages.

## License

Private. All rights reserved.
