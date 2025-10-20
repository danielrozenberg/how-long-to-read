import { defineConfig, globalIgnores } from '@eslint/config-helpers';
import js from '@eslint/js';
import json from '@eslint/json';
import jest from 'eslint-plugin-jest';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/']),
  {
    files: ['**/*.ts', 'eslint.config.mjs'],
    extends: [
      js.configs.recommended,
      prettierRecommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
    },
  },
  {
    files: ['test/**/*.ts'],
    extends: [jest.configs['flat/all']],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'jest/no-hooks': 'off',
      'jest/prefer-expect-assertions': 'off',
      'jest/unbound-method': 'error',
    },
  },
  {
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },
);
