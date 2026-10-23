import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";
export default ts.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "public/python-runtime/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  {
    files: [
      "src/python/**/*.{ts,tsx}",
      "tests/python.test.ts",
      "tests/e2e/python.spec.ts",
    ],
    extends: [js.configs.recommended, ...ts.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["scripts/*python*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["public/python-worker.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.worker, loadPyodide: "readonly" },
    },
  },
);
