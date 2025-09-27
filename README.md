# Oir Project


## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## Scripts

- `npm run dev` – start the development server.
- `npm run build` – build the production application.
- `npm run start` – run the built application.
- `npm run lint` – lint the codebase with ESLint.


## Deployment

Deployments are expected to build from the `main` branch. If you need to trigger a fresh production build without code changes, run:

```bash
git checkout main
git commit --allow-empty -m "trigger production build from Git"
git push origin main
```

The Vercel project should also be configured to run `npm run build`, which executes the `postbuild` script to regenerate the MiniSearch index before serving the app.


## UI toolkit

The project uses [shadcn/ui](https://ui.shadcn.com) components configured for the Oir visual language alongside Tailwind CSS and TypeScript.
