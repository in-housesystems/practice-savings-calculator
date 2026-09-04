# Practice Savings Calculator

https://in-housesystems.com/practice-savings-calculator/

See what a dental or orthodontic practice keeps each month and year when appliances are made in-house — including the full internal cost of bringing production in-house.

## What it does

- Compare lab invoices vs fully loaded in-house cost
- Edit appliance mix: volume, lab fee, materials, labor, scrap
- Include equipment amortization, space, software, utilities, and maintenance
- Switch month / year
- Start from Dental, Ortho, or an empty sheet

Figures stay in the browser (Zustand + `localStorage`). Nothing is sent to a server.

## What's in this repo

Three layers. Do not mix them:

```
src/ + public/     source of truth (edit here)
root index/assets  GitHub Pages snapshot (generated, committed)
archive/           previous live HTML only
```

- **Source:** Vite + TanStack Start SPA (`base` `/practice-savings-calculator/`). Calculator UI and math live under `src/`. Favicon is `public/favicon.svg`.
- **Published snapshot:** GitHub Pages serves committed files at the repo root (`index.html`, `404.html`, `assets/`, `.nojekyll`). Refresh with `npm run pages`.
- **Archive:** `archive/previous-html/` is the previous live Lab Savings HTML. It is not the current app.

## Run locally

```bash
npm install
npm run dev
```

Then open the address Vite prints (this project is configured for port 8080).

```bash
npm test
npm run typecheck
npm run build
npm run pages
```

`npm run pages` runs the production build and copies `dist/client` to the repo root for GitHub Pages.

## Sample data

The Dental preset loads **Northside Dental** with night guards, Essix retainers, occlusal splints, surgical guides, bleaching trays, flippers, and sports mouthguards. Replace the practice name and numbers with your own.

## License

Private. All rights reserved.
