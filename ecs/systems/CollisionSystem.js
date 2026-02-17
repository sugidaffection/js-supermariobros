export class CollisionSystem {
	update(world, scene) {
		const tilemap = world.resources.tilemap
		const entities = world.query(['Transform', 'Velocity', 'Collider'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const collider = world.getComponent(entity.id, 'Collider')
			if (collider.type !== 'dynamic' || !collider.solid) return

			transform.grounded = false
			const potentialTiles = tilemap.querySolids(transform)
			potentialTiles.forEach(tile => {
				const rect = tile.rect
				if (transform.y + transform.h + velocity.y > rect.top &&
					transform.y < rect.top &&
					transform.x + 1 < rect.right &&
					transform.x + transform.w - 1 > rect.left) {
					velocity.y = 0
					transform.y = rect.top - transform.h
					transform.update()
					transform.grounded = true
				} else if (transform.y + velocity.y < rect.bottom &&
					transform.y + transform.h > rect.bottom &&
					transform.x + 1 < rect.right &&
					transform.x + transform.w - 1 > rect.left) {
					transform.y = rect.bottom
					transform.update()
					velocity.y = 1
				}

				if (transform.x + transform.w > rect.left &&
					transform.x < rect.left &&
					transform.y < rect.bottom &&
					transform.y + transform.h > rect.top) {
					transform.x = rect.left - transform.w
					transform.update()
					velocity.x = 0
				} else if (transform.x < rect.right &&
					transform.x + transform.w > rect.right &&
					transform.y < rect.bottom &&
					transform.y + transform.h > rect.top) {
					transform.x = rect.right
					transform.update()
					velocity.x = 0
				}
			})
		})
	}
}
