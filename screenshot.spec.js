const { test, expect } = require('@playwright/test');

test('track mario position', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.waitForSelector('#play');
  await page.click('#play');
  
  const positions = [];
  for (let i = 0; i < 60; i++) {
    const pos = await page.evaluate(() => {
      const world = window.GameInstance.scene.world;
      const player = world.resources.playerEntity;
      const transform = world.getComponent(player, 'Transform');
      const velocity = world.getComponent(player, 'Velocity');
      return { y: transform.y, vy: velocity.y, grounded: transform.grounded };
    });
    positions.push(pos);
    await page.waitForTimeout(16); // ~1 frame
  }
  console.log('Mario movement:', JSON.stringify(positions));
});
