import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import { fixupConfigRules } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tailwindcssPlugin from "eslint-plugin-tailwindcss";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));
const ignores = ["node_modules/", ".next/", "dist/", "coverage/"];

const tsTypeChecked =
  tseslint.configs.recommendedTypeChecked ?? tseslint.configs["recommended-type-checked"];
const tsStylistic =
  tseslint.configs.stylisticTypeChecked ?? tseslint.configs["stylistic-type-checked"];

export default [
  {
    ignores,
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      tailwindcss: tailwindcssPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      tailwindcss: {
        callees: ["cn"],
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...fixupConfigRules(nextPlugin.configs["core-web-vitals"].rules),
      ...tseslint.configs.recommended.rules,
      ...(tsTypeChecked?.rules ?? {}),
      ...(tsStylistic?.rules ?? {}),
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
];
