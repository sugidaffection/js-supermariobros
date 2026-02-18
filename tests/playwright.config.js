module.exports = {
  testDir: './e2e',
  testMatch: '*.spec.js',
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8081',
  },
  outputDir: './test-results',
};
