# Oir Project

This repository hosts the Next.js front-end for the Oir Project, a digital humanities knowledge-graph environment for medieval Irish history. The application provides search, visualization, and exploration interfaces for interconnected datasets such as annals, fiants, bardic poetry, places, and people.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
   > **Tip:** If the npm registry is unreachable in your environment (for example, the 403 responses seen in some CI systems), temporarily switch to a mirror with `npm config set registry <mirror-url>`, install, and then restore the default registry via `npm config delete registry`.
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

## Dependency maintenance

- Direct dependencies track the latest stable releases of the Next.js 15 / React 19 stack to clear deprecated transitive packages previously flagged by Vercel (e.g., `glob@7`, `rimraf@3`, `eslint@8`).
- ESLint now uses the flat-config format (ESLint 9+) with explicit plugin versions so deprecated packages like `@humanwhocodes/*` and legacy `glob`/`rimraf` releases are no longer installed during CI.
- When adding new libraries, prefer actively maintained releases and re-run `npm install` locally to confirm the absence of deprecation warnings before deploying.

## UI toolkit

The project uses [shadcn/ui](https://ui.shadcn.com) components configured for the Oir visual language alongside Tailwind CSS and TypeScript.
