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

			velocity.x += accX
			velocity.y += accY

			if (transform.grounded && input.jumpPressed) {
				velocity.y = velocity.jump
				transform.grounded = false
			}

			transform.x += velocity.x
			transform.y += velocity.y
			transform.update()

			if (transform.x < 0) {
				transform.x = 0
				transform.update()
			}
		})

		const playerTransform = world.getComponent(world.resources.playerEntity, 'Transform')
		const camera = world.resources.camera
		const viewport = world.resources.viewport
		const halfViewport = (viewport.viewportWidth || viewport.w) / 2
		camera.x = Math.max(0, Math.min(camera.maxX, playerTransform.x - halfViewport))
	}
}
