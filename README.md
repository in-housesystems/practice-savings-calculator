# Practice Savings Calculator

https://in-housesystems.com/practice-savings-calculator/

See what a dental or orthodontic practice keeps each month and year when appliances are made in-house — including the full internal cost of bringing production in-house.

## What it does

- Compare lab invoices vs fully loaded in-house cost
- Edit appliance mix: volume, lab fee, materials, labor, scrap
- Include equipment amortization, space, software, utilities, and maintenance
- Switch month / year
- Start from Dental, Ortho, or an empty sheet

Figures stay in the browser. Nothing is sent to a server.

## Run locally

```bash
npm install
npm run dev
```

Then open the address Vite prints (this project is configured for port 8080).

```bash
npm run build
npm run typecheck
```

## Sample data

The Dental preset loads **Northside Dental** with night guards, Essix retainers, occlusal splints, surgical guides, bleaching trays, flippers, and sports mouthguards. Replace the practice name and numbers with your own.

## License

Private. All rights reserved.

## Live

GitHub Pages serves a static client export of this Vite/TanStack Start app from the repo root (`base` `/practice-savings-calculator/`). Auth is off. The previous Lab Savings HTML is in `archive/previous-html/`.
