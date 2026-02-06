module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/client'],

  // Prevent Jest from trying ESM parsing on CommonJS files
  transform: {},

  // Explicitly treat .js files as CommonJS (not ESM)
  extensionsToTreatAsEsm: [],

  // Optional: show more details when failing
  verbose: true,
};
