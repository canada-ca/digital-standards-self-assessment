module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts', 'tsx'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'],
  testURL: 'http://localhost/',
  globals: {
    'ts-jest': {
      babelConfig: false,
    },
  },
  collectCoverage: true,
  coverageDirectory: './.coverage',
  verbose: true,
  collectCoverageFrom: [
    '**/src/components/**/*.vue',
    '**/src/views/**/*.vue',
    '**/src/services/**/*.ts',
    '**/src/store/**/actions.ts',
    '**/src/store/**/mutations.ts',
    '**/src/store/**/getters.ts',
    '**/src/utils/**/*.ts',
    '!**/node_modules/**',
    '!**/src/plugins/**',
    '!**/src/interfaces/**',
  ],
};
