import { Rect } from '../../lib.js'

export class CollisionSystem {
	update(world, scene) {
		const tilemap = world.resources.tilemap
		const entities = world.query(['Transform', 'Velocity', 'Collider'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const collider = world.getComponent(entity.id, 'Collider')
			if (collider.type !== 'dynamic' || !collider.solid) return

			const input = world.getComponent(entity.id, 'Input')
			const wasGrounded = transform.grounded
			transform.grounded = false

			const potentialTiles = tilemap.querySolids(transform)
			potentialTiles.forEach(tile => {
				const rect = tile.rect
				
				// Check vertical collision (ground/ceiling)
				const overlapY = Math.min(transform.bottom, rect.bottom) - Math.max(transform.top, rect.top)
				const overlapX = Math.min(transform.right, rect.right) - Math.max(transform.left, rect.left)
				
				// Resolve smallest overlap first
				if (overlapY < overlapX) {
					// Vertical collision
					if (velocity.y >= 0 && transform.bottom > rect.top && transform.top < rect.top) {
						// Landing on top
						transform.y = rect.top - transform.h
						transform.update()
						velocity.y = 0
						transform.grounded = true
					} else if (velocity.y < 0 && transform.top < rect.bottom && transform.bottom > rect.bottom) {
						// Hitting ceiling
						transform.y = rect.bottom
						transform.update()
						velocity.y = 0
					}
				} else {
					// Horizontal collision
					if (velocity.x >= 0 && transform.right > rect.left && transform.left < rect.left) {
						// Hitting left side
						transform.x = rect.left - transform.w
						transform.update()
						velocity.x = 0
					} else if (velocity.x < 0 && transform.left < rect.right && transform.right > rect.right) {
						// Hitting right side
						transform.x = rect.right
						transform.update()
						velocity.x = 0
					}
				}
			})
		})
	}
}
