/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Student website. The API is the separate backend in ./backend (VITE_API_URL, default http://localhost:8787).
// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./", "./client"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "backend/**", "admin/**"],
    },
  },
  preview: {
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  test: {
    // backend/ and admin/ have their own tooling; backend tests run with `npm --prefix backend test`.
    include: ["client/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
}));
