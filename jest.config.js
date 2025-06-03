const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  globalSetup: "<rootDir>/jest.setup.js",
});

module.exports = jestConfig;
