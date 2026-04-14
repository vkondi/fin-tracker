import { dirname } from "path";
import { fileURLToPath } from "url";
// Import the plugin
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import nextConfig from "eslint-config-next/core-web-vitals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  {
    ignores: ["**/node_modules/", ".next/", "dist/", "build/"],
  },
  ...nextConfig,
  // Add jsx-a11y recommended rules and custom overrides
  {
    settings: {
      react: { version: "19" },
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

export default eslintConfig;
