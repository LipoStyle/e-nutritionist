// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  // Ignore build artifacts
  {
    ignores: ['.next/**', 'out/**', 'dist/**', 'coverage/**', 'node_modules/**', '**/*.min.*'],
  },

  // Next.js presets + Prettier bridge (via compat)
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
  }),

  // Language options
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // Type-aware TypeScript linting (points at your tsconfig)
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    languageOptions: {
      ...cfg.languageOptions,
      parserOptions: {
        ...cfg.languageOptions?.parserOptions,
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),

  // Plugins + rules
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // Prefer auto‑removal of unused imports/vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // Import hygiene
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      'import/no-duplicates': 'warn',
      'import/newline-after-import': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
      },
    },
  },

  // Looser rules for config/infra files
  {
    files: [
      'next.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      'eslint.config.*',
      'prettier.config.*',
      'scripts/**',
    ],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
]
