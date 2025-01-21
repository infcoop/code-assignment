import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["**/*/*.test.ts?(x)"],
    environmentMatchGlobs: [["src/**", "node"]],
    globals: true,
    /**
     * this setup file will be run before each test file, without exceptions
     */

    env: {
      NODE_ENV: "test",
    },
    /**
     * we should only enable coverage once we have a guide on how to use it
     */
    coverage: {
      enabled: false,
      provider: "v8", // or 'istanbul'
    },
  },
});
