const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  globalSetup: "<rootDir>/jest.setup.js",
  testTimeout: 60000, // 60 seconds
});

module.exports = jestConfig;
