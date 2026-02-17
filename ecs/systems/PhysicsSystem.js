class PhysicsSystem {
	update(world, dt) {
		const entities = world.query(['Transform', 'Velocity', 'Input'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity, 'Transform')
			const velocity = world.getComponent(entity, 'Velocity')
			const input = world.getComponent(entity, 'Input')

			let accX = 0
			let accY = velocity.mass
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

			transform.x += velocity.x
			transform.y += velocity.y

			if (transform.x < 0) transform.x = 0
		})

		const player = world.getComponent(world.resources.playerEntity, 'Transform')
		const camera = world.resources.camera
		const halfViewport = camera.viewportWidth / 2
		camera.x = Math.max(0, Math.min(camera.maxX, player.x - halfViewport))
	}
}
