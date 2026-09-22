# Frontend Architecture (Next.js PWA)

- **Framework**: Next.js App Router (React + TypeScript).
- **Styling**: Tailwind CSS with custom earth/agricultural palette tokens.
- **State Management**:
  - Global client state: Zustand (`auth-store`, `farmer-store`, `cart-store`, `ui-store`).
  - Server state / Caching: TanStack Query.
- **Form Management**: React Hook Form with Zod schema validation.
- **Offline & Installability**: Web App Manifest (`manifest.json`) and Service Worker (`sw.js`).
