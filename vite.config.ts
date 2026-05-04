import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./testing/setupTests.ts"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}"],
      exclude: ["app/generated/**"],
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
});
