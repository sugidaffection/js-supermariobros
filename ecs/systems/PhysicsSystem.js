export class PhysicsSystem {
	update(world) {
		const entities = world.query(['Transform', 'Velocity', 'Collider'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const collider = world.getComponent(entity.id, 'Collider')
			const input = world.getComponent(entity.id, 'Input')
			const state = world.getComponent(entity.id, 'State')
			let gravityScale = 1

			if (!transform || !velocity || !collider) return
			if (collider.type !== 'dynamic' || !collider.solid) return
			if (state && state.value === 'dead') return

			if (input) {
				const moveDir = Number(input.right) - Number(input.left)
				const maxSpeed = velocity.speed || 0
				const accelGround = 0.7
				const accelAir = 0.35
				const accel = transform.grounded ? accelGround : accelAir

				// Smooth accel/decel for player movement.
				if (moveDir !== 0) {
					velocity.x += moveDir * accel
					if (velocity.x > maxSpeed) velocity.x = maxSpeed
					if (velocity.x < -maxSpeed) velocity.x = -maxSpeed
				} else {
					if (transform.grounded) {
						velocity.x *= velocity.friction
						if (Math.abs(velocity.x) < 0.1) velocity.x = 0
					} else {
						velocity.x *= 0.985
					}
				}

				if (transform.grounded && input.jumpPressed) {
					velocity.y = velocity.jump
					transform.grounded = false
					input.jumpPressed = false
				}

				// Variable jump height: hold jump to rise higher.
				if (!transform.grounded && velocity.y < 0) {
					gravityScale = input.up ? 0.72 : 1.45
				} else if (!transform.grounded && velocity.y > 0) {
					gravityScale = 1.1
				}
			} else {
				// Keep enemies moving at their intended pace.
				if (Math.abs(velocity.x) < 0.01) {
					const facingDir = state && state.facing === 'right' ? 1 : -1
					velocity.x = facingDir * (velocity.speed || 2)
				}
			}

			if (state && !input && velocity.x !== 0) {
				state.facing = velocity.x < 0 ? 'left' : 'right'
			}

			velocity.y += velocity.gravity * gravityScale
			if (velocity.y > 16) velocity.y = 16

			transform.x += velocity.x
			transform.y += velocity.y
			transform.update()

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
