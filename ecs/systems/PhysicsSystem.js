class PhysicsSystem {
	update(world, dt) {
		const entities = world.query(['Transform', 'Velocity', 'Input'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const input = world.getComponent(entity.id, 'Input')

			let accX = 0
			let accY = velocity.gravity

			if (input.right) accX = velocity.speed
			if (input.left) accX = -velocity.speed

			accX += velocity.x * -velocity.friction
			accY += velocity.y * velocity.gravity

			velocity.x += accX * dt
			velocity.y += accY * dt

			if (transform.grounded && input.jumpPressed) {
				velocity.y = velocity.jump
				transform.grounded = false
			}

			transform.x += velocity.x * dt * 60
			transform.y += velocity.y * dt

			if (transform.x < 0) transform.x = 0
		})

		const playerTransform = world.getComponent(world.resources.playerEntity, 'Transform')
		const camera = world.resources.camera
		const halfViewport = camera.viewportWidth / 2
		camera.x = Math.max(0, Math.min(camera.maxX, playerTransform.x - halfViewport))
	}
}
