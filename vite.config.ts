import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        // Split third-party framework code into a long-lived cached chunk so the
        // main entry no longer carries react/react-dom/framer-motion inline.
        manualChunks: {
          vendor: ["react", "react-dom", "framer-motion"],
          // The 394 KB programme catalogue (data.ts) is only needed by
          // lazily-loaded routes and the on-demand concierge/search. Keeping it
          // out of the main entry chunk reduces the initial payload for every
          // visitor, including homepage hits that never open the catalogue.
          "catalogue-data": ["src/lib/data.ts"],
        },
      },
    },
    outDir: process.env.GIBS_DIST_DIR
      ? path.resolve(__dirname, process.env.GIBS_DIST_DIR)
      : "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
