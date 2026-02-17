const { test, expect } = require('@playwright/test');

test('find all unique colors on canvas', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.waitForSelector('#play');
  await page.click('#play');
  await page.waitForTimeout(3000);

  const colors = await page.evaluate(() => {
    const canvas = document.querySelector('#game');
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorSet = new Set();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i+3] > 0) {
        colorSet.add(`${data[i]},${data[i+1]},${data[i+2]}`);
      }
    }
    return Array.from(colorSet);
  });

  console.log('Unique non-transparent colors:', JSON.stringify(colors));
});
