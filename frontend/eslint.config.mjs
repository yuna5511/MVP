import react from "eslint-plugin-react";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

// Import the react-app config after installation
import reactAppConfig from "eslint-config-react-app";

export default [
  {
    ignores: ["node_modules", "dist", "build"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
    },
    extends: [
      reactAppConfig, // Add react-app configuration
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    plugins: { react, "@typescript-eslint": typescript, prettier },
    rules: {
      "react/react-in-jsx-scope": "off", // React 18 does not need this
      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
    },
    settings: {
      react: {
        version: "18.3",
      },
    },
  },
];
