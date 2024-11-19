import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.test.ts',
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/src/__tests__/integration/' // Ignore integration tests in regular test runs
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/src/__tests__/'
    ],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    testTimeout: 10000,
    setupFilesAfterEnv: ['./src/__tests__/integration/setup.ts'],
    detectOpenHandles: true,
    maxWorkers: 1,
};

export default config; 