export class RenderSystem {
	update(world) {
		const ctx = world.resources.ctx
		const viewport = world.resources.viewport
		const cameraX = world.resources.camera.x
		ctx.clearRect(0, 0, viewport.w, viewport.h)

		world.resources.tilemap.render(ctx, cameraX)

		const entities = world.query(['Transform', 'Sprite'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const sprite = world.getComponent(entity.id, 'Sprite')
			const animation = world.resources.animations.get(entity.id)
			if (!animation) return
			
			// Skip rendering if image not loaded
			const firstSprite = animation.sprites[Object.keys(animation.sprites)[0]]
			if (!firstSprite || !firstSprite[0] || !firstSprite[0].image.complete) return
			
			animation.speed = 0.2
			animation.play(
				ctx,
				sprite.animation,
				{ x: transform.x - cameraX, y: transform.y, w: transform.w, h: transform.h },
				sprite.flip
			)
		})
	}
}
