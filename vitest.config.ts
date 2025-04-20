import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    exclude: ["./tests/e2e/**", "node_modules/**"],
  },
  plugins: [tsconfigPaths()],
});
