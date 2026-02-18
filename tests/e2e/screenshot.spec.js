const { test, expect } = require('@playwright/test');

test('inspect systems and resources', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.waitForSelector('#play');
  await page.click('#play');
  
  const info = await page.evaluate(() => {
    const world = window.GameInstance.scene.world;
    return {
      systemCount: world.systems.length,
      systems: world.systems.map(s => s.constructor.name || 'Anonymous'),
      gravity: world.resources.playerEntity ? world.getComponent(world.resources.playerEntity, 'Velocity').gravity : 'null'
    };
  });
  console.log('World Info:', JSON.stringify(info));
});
