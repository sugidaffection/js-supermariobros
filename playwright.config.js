module.exports = {
  testDir: '.',
  testMatch: '*.spec.js',
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8081',
  },
};
