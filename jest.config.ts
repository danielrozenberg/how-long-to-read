import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  rootDir: 'test',
  setupFiles: ['jest-webextension-mock'],
  testEnvironment: 'jsdom',
};

export default jestConfig;
