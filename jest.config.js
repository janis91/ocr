module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '^@a/(.*)$': '<rootDir>/src/app/$1',
    '^@s/(.*)$': '<rootDir>/src/settings/$1'
  },
  testMatch: [
    '**/tests/js/unit/**/*.spec.[jt]s?(x)'
  ]
}
