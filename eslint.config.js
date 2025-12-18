// @ts-check
const eslint = require("@eslint/js");
const {defineConfig} = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const importPlugin = require('eslint-plugin-import');

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      import: importPlugin
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "single", {"avoidEscape": true, "allowTemplateLiterals": true}],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',    // fs, path
            'external',   // rxjs, @angular/*
            'internal',   // @app/*, @features/*
            'parent',     // ../
            'sibling',    // ./
            'index',      // ./index
            'object',     // import log = console.log
            'type',       // import type {}
          ],

          pathGroups: [
            {
              pattern: '@angular/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@features/**',
              group: 'internal',
            },
            {
              pattern: '@shared/**',
              group: 'internal',
            },
            {
              pattern: '@core/**',
              group: 'internal',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin'],

          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      "object-curly-spacing": ['error', 'always'],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);
