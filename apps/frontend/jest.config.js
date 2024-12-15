module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/",
    ],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  };
  