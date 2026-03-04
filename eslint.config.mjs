import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.config({
    env: {
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],
    overrides: [
      {
        files: [
          "bench/index.js",
          "test/browser.test.ts",
          "test/timedBrowser.test.ts",
          "test/browserModule.ts",
        ],
        rules: {
          "@typescript-eslint/no-require-imports": "off",
        },
      },
    ],
  }),
];
