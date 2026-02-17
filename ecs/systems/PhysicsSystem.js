import { Rect } from '../../lib.js'

export class PhysicsSystem {
	update(world, dt) {
		const entities = world.query(['Transform', 'Velocity'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const input = world.getComponent(entity.id, 'Input')

			if (input) {
				// Player input handling
				if (input.right) {
					velocity.x = velocity.speed
				} else if (input.left) {
					velocity.x = -velocity.speed
				} else {
					// Apply friction when no horizontal input
					velocity.x *= velocity.friction
					if (Math.abs(velocity.x) < 0.1) velocity.x = 0
				}

				// Jump only when grounded
				if (transform.grounded && input.jumpPressed) {
					velocity.y = velocity.jump
					transform.grounded = false
					input.jumpPressed = false
				}
			} else {
				// Enemy AI - constant movement with friction
				velocity.x *= (1 - velocity.friction)
			}

			// Apply gravity
			velocity.y += velocity.gravity

			// Apply velocity to position
			transform.x += velocity.x
			transform.y += velocity.y
			transform.update()

			// Keep in bounds
			if (transform.x < 0) {
				transform.x = 0
				transform.update()
			}
		})

		// Update camera
		const playerEntityId = world.resources.playerEntity
		if (playerEntityId) {
			const playerTransform = world.getComponent(playerEntityId, 'Transform')
			if (playerTransform) {
				const camera = world.resources.camera
				const viewport = world.resources.viewport
				const halfViewport = (viewport.viewportWidth || viewport.w) / 2
				camera.x = Math.max(0, Math.min(camera.maxX, playerTransform.x - halfViewport))
			}
		}
	}
}
