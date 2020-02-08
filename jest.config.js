module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  globals: {
    'ts-jest': {
      disableSourceMapSupport: true
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@a/(.*)$': '<rootDir>/src/app/$1',
    '^@s/(.*)$': '<rootDir>/src/settings/$1'
  },
  testMatch: [
    '**/tests/js/**/*.spec.[jt]s?(x)'
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,vue}', '!**/node_modules/**'],
  coverageDirectory: 'tests/js/coverage',
  coverageReporters: ['lcov'],
  silent: true
}
