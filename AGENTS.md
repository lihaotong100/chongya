## Cursor Cloud specific instructions

This is a static Vite + React single-page application (landing page for a meme token). There is no backend, database, or external service dependency.

### Running the app

- `npm run dev` starts the Vite dev server at `http://localhost:5173/`
- `npm run build` produces a production bundle in `dist/`
- `npm run preview` serves the production build locally

### Key details

- All scripts and dependencies are defined in `package.json` — see README.md for full usage.
- The project has no linter, no test framework, and no git hooks configured.
- Translations (EN/ZH) are in `src/i18n.jsx`; external links and contract address are in `src/config.js`.
- Static assets (images, music, share pages) live under `public/`.
