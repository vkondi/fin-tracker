import { dirname } from "path";
import { fileURLToPath } from "url";
// Import the plugin
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import nextConfig from "eslint-config-next/core-web-vitals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  {
    ignores: ["**/node_modules/", ".next/", "dist/", "build/"],
  },
  ...nextConfig,
  // TypeScript configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  // Add jsx-a11y recommended rules and custom overrides
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    settings: {
      react: { version: "19" },
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
    },
  },
];

export default eslintConfig;
