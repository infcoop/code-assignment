import path from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ["**/__test__/*.test.ts?(x)", "**/*.test.ts?(x)"],
    // environmentMatchGlobs: [["nextjs/**", "jsdom"]],
    environment: "jsdom",
    deps: {
      optimizer: {
        web: {
          include: ["vitest-canvas-mock"],
        },
      },
    },
    globals: true,
    alias: {
      "@inf/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },

    /**
     * this setup file will be run before each test file, without exceptions
     */
    setupFiles: ["./vitest.setup.ts"],
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
