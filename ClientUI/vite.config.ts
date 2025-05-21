import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // or your desired port
  },
  build: {
    outDir: "dist", // Default for Vite, adjust if necessary
  },
});
