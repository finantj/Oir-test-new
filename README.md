# Oir Project

This repository contains the Next.js front-end for the Oir Project, a digital humanities knowledge-graph environment for medieval Irish history. The application provides search, visualization, and exploration interfaces for interconnected datasets such as annals, fiants, bardic poetry, places, and people.

## Getting started

1. Install dependencies (the project now tracks the latest stable releases of Next.js 15, React 19, and the supporting build toolchain):
   ```bash
   npm install
   ```
   > **Heads up:** If your environment cannot reach the npm registry (for example, due to the 403 errors seen in some CI builds), temporarily point npm at an alternate mirror with `npm config set registry <mirror-url>`, reinstall, and then restore the default registry via `npm config delete registry`.
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

- Direct dependencies have been bumped to their latest major versions to clear deprecated transitive packages flagged by Vercel (e.g., `glob@7`, `rimraf@3`, `eslint@8`).
- The `package.json` `overrides` field forces modern replacements for deprecated build tooling; extend this list if future warnings surface.
- When adding new libraries, prefer actively maintained releases and re-run `npm install` locally to confirm the absence of deprecation warnings before deploying.

## UI toolkit

The project uses [shadcn/ui](https://ui.shadcn.com) components configured for the Oir visual language alongside Tailwind CSS and TypeScript.
