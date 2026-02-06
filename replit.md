# Overview

This is a **Rice Leaf Disease Detection** web application that uses a TensorFlow Lite machine learning model running in the browser to classify rice leaf images into five categories: Healthy, Tungro, BrownSpot, Blast, and BacterialBlight. Users can capture or upload leaf images, get instant AI-powered disease predictions with confidence scores, and save scan results to a database for historical tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend (React + Vite)

- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with two pages: Home (scan) and History
- **Styling**: Tailwind CSS with shadcn/ui component library (new-york style), custom green/medical theme with CSS variables for light/dark mode
- **State Management**: TanStack React Query for server state (fetching/caching scan history, creating scans)
- **ML Inference**: TensorFlow.js with TFLite backend runs entirely client-side in the browser
  - Model file served from `client/public/models/model.tflite`
  - Labels file at `client/public/models/labels.txt`
  - Images are processed on the client, then results (predictions, top label, confidence) are sent to the backend for storage
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

## Backend (Express + Node.js)

- **Framework**: Express.js with TypeScript, run via tsx
- **API Design**: REST API with route definitions shared between client and server via `shared/routes.ts`
  - `GET /api/scans` — list all scans
  - `POST /api/scans` — create a new scan result
- **Validation**: Zod schemas (generated from Drizzle via drizzle-zod) validate request bodies
- **Storage Layer**: `server/storage.ts` provides a `DatabaseStorage` class implementing an `IStorage` interface, making it easy to swap storage backends

## Shared Code (`shared/`)

- **Schema** (`shared/schema.ts`): Drizzle ORM schema defining a `scans` table with fields: id, imageUrl, predictions (JSONB), topLabel, confidence, createdAt
- **Routes** (`shared/routes.ts`): Centralized API route definitions with paths, methods, and Zod schemas used by both frontend hooks and backend handlers

## Database

- **PostgreSQL** via Drizzle ORM with node-postgres (pg) driver
- **Migrations**: Drizzle Kit configured in `drizzle.config.ts`, migrations output to `./migrations`
- **Schema push**: Use `npm run db:push` to sync schema to database
- **Connection**: Requires `DATABASE_URL` environment variable

## Build System

- **Development**: `npm run dev` runs tsx with Vite dev server middleware (HMR via `server/vite.ts`)
- **Production**: `npm run build` uses a custom build script (`script/build.ts`) that runs Vite for the client and esbuild for the server, outputting to `dist/`
- **Server bundling**: The build script bundles specific server dependencies (allowlisted) to reduce cold start times while keeping others external

## Key Design Decisions

1. **Client-side ML inference**: The TFLite model runs in the browser using WebGL acceleration, meaning no server GPU is needed. Only the results are sent to the backend.
2. **Shared route contracts**: Both client and server reference the same route definitions and Zod schemas from `shared/`, ensuring type safety across the stack.
3. **Mobile-first UI**: The layout uses a bottom navigation bar, max-width container (max-w-md), and responsive design optimized for mobile devices with camera capture support.

# External Dependencies

- **PostgreSQL**: Required database, connected via `DATABASE_URL` environment variable
- **TensorFlow.js TFLite WASM**: Loaded from CDN (`cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.10/dist/`)
- **Google Fonts**: Outfit, Plus Jakarta Sans, DM Sans, Fira Code, Geist Mono, Architects Daughter loaded from fonts.googleapis.com
- **No authentication**: The app currently has no auth system — all scans are publicly accessible
- **No external file storage**: Image URLs (likely base64 data URIs) are stored directly in the database rather than uploaded to S3 or similar