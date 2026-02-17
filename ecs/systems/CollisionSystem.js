import { Rect } from '../../lib.js'

export class CollisionSystem {
	update(world, scene) {
		const tilemap = world.resources.tilemap
		const entities = world.query(['Transform', 'Velocity', 'Collider'])
		
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const collider = world.getComponent(entity.id, 'Collider')
			const input = world.getComponent(entity.id, 'Input')
			
			if (collider.type !== 'dynamic' || !collider.solid) return

			// Reset grounded state
			transform.grounded = false

			// Get potential collision tiles
			const potentialTiles = tilemap.querySolids(transform)
			
			potentialTiles.forEach(tile => {
				const rect = tile.rect
				
				// Ground collision (falling down onto tile)
				if (transform.bottom + velocity.y > rect.top &&
					transform.top < rect.top &&
					transform.left + 1 < rect.right &&
					transform.right - 1 > rect.left) {
					velocity.y = 0
					transform.y = rect.top - transform.h
					transform.update()
					transform.grounded = true
				}
				// Ceiling collision (jumping up into tile)
				else if (transform.top + velocity.y < rect.bottom &&
					transform.bottom > rect.bottom &&
					transform.left + 1 < rect.right &&
					transform.right - 1 > rect.left) {
					transform.y = rect.bottom
					transform.update()
					velocity.y = 1
				}

				// Left side collision
				if (transform.right > rect.left &&
					transform.left < rect.left &&
					transform.top < rect.bottom &&
					transform.bottom > rect.top) {
					transform.x = rect.left - transform.w
					transform.update()
					if (input) {
						velocity.x = 0
					} else {
						velocity.x *= -1 // Enemy bounce
					}
				}
				// Right side collision
				else if (transform.left < rect.right &&
					transform.right > rect.right &&
					transform.top < rect.bottom &&
					transform.bottom > rect.top) {
					transform.x = rect.right
					transform.update()
					if (input) {
						velocity.x = 0
					} else {
						velocity.x *= -1 // Enemy bounce
					}
				}
			})
		})
	}
}
