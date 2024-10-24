// @ts-check
import eslint from '@eslint/js';
import pluginShopify from '@shopify/eslint-plugin';
import configPrettier from 'eslint-config-prettier';
import pluginHtml from 'eslint-plugin-html';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint'; // eslint-disable-line import/no-unresolved

const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...pluginShopify.configs.esnext,
  ...pluginShopify.configs.node,
  ...pluginShopify.configs.typescript,
  ...pluginShopify.configs['typescript-type-checking'],
  ...pluginShopify.configs.react,
  // ==========================================================================
  // JavaScript & TypeScript
  // ==========================================================================
  {
    files: ['**/*.{cjs,html,js,jsx,mjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.html'],
      },
    },
    plugins: {
      'simple-import-sort': pluginSimpleImportSort,
      html: pluginHtml,
    },
    settings: {
      'html/indent': '+2',
      'html/report-bad-indent': 'error',
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'no-use-before-define': [
        'error',
        {
          variables: false,
          functions: false,
        },
      ],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      '@shopify/prefer-early-return': [
        'warn',
        {
          maximumStatements: 2,
        },
      ],
    },
  },
  // ==========================================================================
  // JavaScript ONLY
  // ==========================================================================
  {
    files: ['**/*.{cjs,html,js,jsx,mjs}'],
    // HACK: Explicitly disable type checking for TypeScript.
    //
    // See also:
    // https://typescript-eslint.io/getting-started/typed-linting/#how-can-i-disable-type-aware-linting-for-a-subset-of-files
    ...tseslint.configs.disableTypeChecked,
  },
  // ==========================================================================
  // TypeScript ONLY
  // ==========================================================================
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // See also:
      // https://github.com/typescript-eslint/typescript-eslint/issues/2540#issuecomment-692866111
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
    },
  },
  // ==========================================================================
  // Prettier
  // ==========================================================================
  configPrettier,
  ...pluginShopify.configs.prettier,
  // ==========================================================================
  // Ignores
  // ==========================================================================
  {
    ignores: ['./husky/*'],
  },
);

export default config;
