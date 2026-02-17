import { Rect } from './lib.js'
import { SpriteAnimation } from './spritesheet.js'

export function createMarioEntity(world, spritesheet) {
	const sprites = spritesheet.get_sprites({
		idle: [[5, 2.13, 16, 16]],
		walk: [[6.07, 2.13, 16, 16], [7.15, 2.13, 16, 16], [8.2, 2.13, 16, 16]],
		turn: [[9.25, 2.13, 16, 16]],
		jump: [[10.3, 2.13, 16, 16]]
	})

	const entityId = world.createEntity({
		Transform: new Rect(32, 320, 32, 32),
		Velocity: { x: 0, y: 0, speed: 5, jump: -11, friction: 0.85, gravity: 1.2, mass: 1 },
		Collider: { type: 'dynamic', solid: true, gridX: 0, gridY: 0 },
		Sprite: { animation: 'idle', flip: false },
		Input: { up: false, left: false, right: false, jumpPressed: false },
		State: { value: 'idle', facing: 'right', won: false }
	})
	world.getComponent(entityId, 'Transform').grounded = false

	world.resources.playerEntity = entityId
	world.resources.animations.set(entityId, new SpriteAnimation(sprites))

	return entityId
}

export function createEnemyEntities(world, spriteSheet, mapEnemies) {
	mapEnemies.forEach((enemyDef) => {
		const sprites = spriteSheet.get_sprites({
			walk: [[0, 1, 16, 16], [1, 1, 16, 16]]
		})

		enemyDef.position.forEach((pos) => {
			const entityId = world.createEntity({
				Transform: new Rect(pos[0] * 32, pos[1] * 32, 32, 32),
				Velocity: { x: -2, y: 0, speed: 2, friction: 0, gravity: 1.2, mass: 1 },
				Collider: { type: 'dynamic', solid: true, gridX: 0, gridY: 0 },
				Sprite: { animation: 'walk', flip: true },
				State: { value: 'walk', facing: 'left', won: false }
			})
			world.getComponent(entityId, 'Transform').grounded = false
			world.resources.animations.set(entityId, new SpriteAnimation(sprites))
		})
	})
}
