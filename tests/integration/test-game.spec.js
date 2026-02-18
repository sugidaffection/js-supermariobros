const { test, expect } = require('@playwright/test');

test('game loads and plays without critical errors', async ({ page }) => {
  // Collect console messages
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      errors.push(text);
    }
    console.log(`[CONSOLE ${msg.type()}] ${text}`);
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
    errors.push(error.message);
  });

  // Navigate to the game
  await page.goto('http://localhost:8081');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Wait for play button and click it
  await page.waitForSelector('#play');
  await page.click('#play');

  // Wait a bit for the game to initialize
  await page.waitForTimeout(3000);

  // Check canvas is now visible
  const canvas = await page.$('#game');
  const isVisible = await canvas.isVisible();
  console.log(`Canvas visible: ${isVisible}`);

  // Log all console messages for debugging
  console.log('\n=== All Console Messages ===');
  consoleMessages.forEach(m => console.log(`[${m.type}] ${m.text}`));
  
  // Check for critical errors (undefined access)
  const criticalErrors = errors.filter(e => e.includes('undefined') || e.includes('TypeError'));
  console.log('\n=== Critical Errors ===');
  console.log(criticalErrors);
  
  expect(criticalErrors.length).toBe(0);
});

test('play button is visible', async ({ page }) => {
  await page.goto('http://localhost:8081');
  const playButton = await page.waitForSelector('#play');
  expect(playButton).toBeTruthy();
});
