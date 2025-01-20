import baseConfig, { restrictEnvAccess } from "@inf/eslint-config/base";
import nextjsConfig from "@inf/eslint-config/nextjs";
import reactConfig from "@inf/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
