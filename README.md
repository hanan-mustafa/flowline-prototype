# Flowline prototype

Clickable prototype of Flowline, an AI-led application management (AMS) service run around business flows.
It plays one scripted incident (SAP transport TR-4471 breaks e-invoicing in order-to-cash) through three role views:
application owner, L2/L3 engineer and L1 analyst.

- React + Vite + Tailwind, static site, no backend and no live AI calls
- All scenario data lives in `src/data/scenario.js`; business figures are illustrative sample data
- Use the story timeline at the bottom (or the arrow keys) to step through the incident

```
npm install
npm run dev
```

Deploys to Vercel as a static Vite site (build command `npm run build`, output `dist`).
