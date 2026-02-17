function createMarioEntity(world, spritesheet) {
	const sprites = spritesheet.get_sprites({
		idle: [[5, 2.13, 16, 16]],
		walk: [[6.07, 2.13, 16, 16], [7.15, 2.13, 16, 16], [8.2, 2.13, 16, 16]],
		turn: [[9.25, 2.13, 16, 16]],
		jump: [[10.3, 2.13, 16, 16]]
	})

	const entityId = world.createEntity({
		Transform: { x: 32, y: 320, w: 32, h: 32, grounded: false },
		Velocity: { x: 0, y: 0, speed: 8, jump: -12, friction: 16, gravity: 42, mass: 1 },
		Collider: { type: 'dynamic', solid: true, gridX: 0, gridY: 0 },
		Sprite: { animation: new SpriteAnimation(sprites), flip: false },
		Input: { up: false, left: false, right: false, jumpPressed: false },
		State: { value: 'idle', facing: 'right', won: false }
	})

	world.resources.playerEntity = entityId
	world.resources.animations.set(entityId, new SpriteAnimation(sprites))

	return entityId
}

function createEnemyEntities(world, spriteSheet, mapEnemies) {
	const sprites = spriteSheet.get_sprites({
		walk: [[0, 1, 16, 16], [1, 1, 16, 16]]
	})

	mapEnemies.forEach((enemyDef) => {
		enemyDef.position.forEach((pos) => {
			const entityId = world.createEntity({
				Transform: { x: pos[0] * 32, y: pos[1] * 32, w: 32, h: 32, grounded: false },
				Velocity: { x: -2, y: 0, speed: 2, jump: 0, friction: 0, gravity: 42, mass: 1 },
				Collider: { type: 'dynamic', solid: true, gridX: 0, gridY: 0 },
				Sprite: { animation: new SpriteAnimation(sprites), flip: true },
				Input: { up: false, left: false, right: false, jumpPressed: false },
				State: { value: 'walk', facing: 'left', won: false }
			})
			world.resources.animations.set(entityId, new SpriteAnimation(sprites))
		})
	})
}
