# CHONGYA · 冲鸭

The cutest duck on BNB Chain. Landing page built with **Vite + React**.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Production build

```bash
npm run build      # output: dist/
npm run preview    # preview the build locally
```

## Deploy to Vercel

This is a standard Vite app and works out of the box.

**Option A — Dashboard:**
1. Push this folder to a GitHub repo.
2. On https://vercel.com, click **New Project** and import the repo.
3. Vercel auto-detects Vite. Defaults:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**.

**Option B — CLI:**
```bash
npm i -g vercel
vercel        # follow prompts; accept defaults
vercel --prod # deploy to production
```

## Customize

- Replace `CONTRACT` in `src/components/Tokenomics.jsx` with your real BSC contract address.
- Update social URLs in `src/components/Nav.jsx`, `Community.jsx`, and `Footer.jsx`.
- Hero / squad / community images live in `public/images/`.
- Copy & numbers are inline in each component for easy tweaking.
# chongya
