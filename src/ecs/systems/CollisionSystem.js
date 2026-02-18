export class CollisionSystem {
	update(world) {
		const tilemap = world.resources.tilemap
		const entities = world.query(['Transform', 'Velocity', 'Collider'])
		
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const collider = world.getComponent(entity.id, 'Collider')
			const input = world.getComponent(entity.id, 'Input')
			const state = world.getComponent(entity.id, 'State')
			
			if (!transform || !velocity || !collider) return
			if (collider.type !== 'dynamic' || !collider.solid) return
			if (state && state.value === 'dead') return

			const prevX = transform.x - velocity.x
			const prevY = transform.y - velocity.y

			transform.grounded = false

			// Resolve vertical collisions first.
			tilemap.querySolids(transform).forEach(tile => {
				const rect = tile.rect
				const overlapsX = transform.right - 1 > rect.left && transform.left + 1 < rect.right
				if (!overlapsX) return

				if (velocity.y >= 0 &&
					prevY + transform.h <= rect.top &&
					transform.y + transform.h >= rect.top) {
					velocity.y = 0
					transform.y = rect.top - transform.h
					transform.update()
					transform.grounded = true
				} else if (velocity.y < 0 &&
					prevY >= rect.bottom &&
					transform.y <= rect.bottom) {
					transform.y = rect.bottom
					transform.update()
					velocity.y = 0
				}
			})

			// Resolve horizontal collisions after vertical placement.
			tilemap.querySolids(transform).forEach(tile => {
				const rect = tile.rect
				const overlapsY = transform.bottom - 1 > rect.top && transform.top + 1 < rect.bottom
				if (!overlapsY) return

				if (velocity.x > 0 &&
					prevX + transform.w <= rect.left &&
					transform.x + transform.w >= rect.left) {
					transform.x = rect.left - transform.w
					transform.update()
					if (input) {
						velocity.x = 0
					} else {
						velocity.x = -Math.abs(velocity.x)
					}
				} else if (velocity.x < 0 &&
					prevX >= rect.right &&
					transform.x <= rect.right) {
					transform.x = rect.right
					transform.update()
					if (input) {
						velocity.x = 0
					} else {
						velocity.x = Math.abs(velocity.x)
					}
				}
			})
		})
	}
}
