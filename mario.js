function createMarioEntity(world, spritesheet) {
	const sprites = spritesheet.get_sprites({
		idle: [[5, 2.13, 16, 16]],
		walk: [[6.07, 2.13, 16, 16], [7.15, 2.13, 16, 16], [8.2, 2.13, 16, 16]],
		turn: [[9.25, 2.13, 16, 16]],
		jump: [[10.3, 2.13, 16, 16]]
	})

	return world.createEntity({
		tag: { type: 'player' },
		transform: { rect: new Rect(32, 320, 32, 32), flip: false },
		physics: { vel: new Vector2(), acc: new Vector2(), speed: 8, jump: -12, gravity: 42, drag: 16, grounded: false },
		sprite: { animation: new SpriteAnimation(sprites), state: 'idle' },
		fsm: new StateMachine('idle', {
			idle: ['run', 'jump'],
			run: ['idle', 'turn', 'jump'],
			turn: ['run', 'idle', 'jump'],
			jump: ['idle', 'run']
		})
	})
}

function createEnemyEntities(world, spriteSheet, mapEnemies) {
	const sprites = spriteSheet.get_sprites({
		walk: [[0, 1, 16, 16], [1, 1, 16, 16]]
	})

	mapEnemies.forEach((enemyDef) => {
		enemyDef.position.forEach((pos) => {
			world.createEntity({
				tag: { type: 'enemy' },
				transform: { rect: new Rect(pos[0] * 32, pos[1] * 32, 32, 32), flip: true },
				physics: { vel: new Vector2(-2, 0), acc: new Vector2(), speed: 2, jump: 0, gravity: 42, drag: 0, grounded: false },
				sprite: { animation: new SpriteAnimation(sprites), state: 'walk' }
			})
		})
	})
}
