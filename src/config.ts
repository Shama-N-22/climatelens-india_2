// File: src/config.ts
// Base URL of the Earth Engine backend.
// Local dev defaults to localhost; in production set VITE_API_URL (see .env).
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:8080";