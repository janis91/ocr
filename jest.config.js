module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@a/(.*)$': '<rootDir>/src/app/$1',
    '^@s/(.*)$': '<rootDir>/src/settings/$1'
  },
  testMatch: [
    '**/tests/js/unit/**/*.spec.[jt]s?(x)'
  ],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,vue}', '!**/node_modules/**'],
  coverageDirectory: 'tests/js/unit/coverage',
  coverageReporters: ['lcov']
}
