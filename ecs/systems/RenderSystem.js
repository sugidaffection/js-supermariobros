class RenderSystem {
	update(world) {
		const ctx = world.resources.ctx
		const viewport = world.resources.viewport
		const cameraX = world.resources.camera.x
		ctx.clearRect(0, 0, viewport.w, viewport.h)

		world.resources.tilemap.render(ctx, cameraX)

		const entities = world.query(['Transform', 'Sprite'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity, 'Transform')
			const sprite = world.getComponent(entity, 'Sprite')
			const animation = world.resources.animations.get(entity)
			if (!animation) return
			animation.speed = world.getComponent(entity, 'Velocity').speed * world.resources.time.dt
			animation.play(
				ctx,
				sprite.animation,
				new Rect(transform.x - cameraX, transform.y, transform.w, transform.h),
				sprite.flip,
			)
		})
	}
}
