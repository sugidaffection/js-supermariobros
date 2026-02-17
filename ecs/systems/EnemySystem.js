export class EnemySystem {
	update(world, dt) {
		const tilemap = world.resources.tilemap
		const entities = world.query(['Transform', 'Velocity', 'Collider', 'State'])
		
		entities.forEach(entity => {
			const state = world.getComponent(entity.id, 'State')
			if (state.value !== 'walk') return // Skip non-walking enemies
			
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const collider = world.getComponent(entity.id, 'Collider')
			
			if (collider.type !== 'dynamic' || !collider.solid) return
			
			// Apply gravity
			velocity.y += velocity.gravity * dt
			transform.grounded = false
			
			// Move enemy
			transform.x += velocity.x * dt * 60
			transform.y += velocity.y * dt
			transform.update()
			
			// Check collision with tiles
			const potentialTiles = tilemap.querySolids(transform)
			potentialTiles.forEach(tile => {
				const rect = tile.rect
				
				// Vertical collision (ground detection)
				if (transform.y + transform.h > rect.top &&
					transform.y < rect.top &&
					transform.x + 10 < rect.right &&
					transform.x + transform.w - 10 > rect.left) {
					velocity.y = 0
					transform.y = rect.top - transform.h
					transform.grounded = true
					transform.update()
				}
				
				// Horizontal collision (wall detection - reverse direction)
				if (velocity.x < 0 && // Moving left
					transform.x < rect.right &&
					transform.x + transform.w > rect.left &&
					transform.y + transform.h > rect.top &&
					transform.y < rect.bottom) {
					transform.x = rect.right
					velocity.x = Math.abs(velocity.x) // Reverse to right
					transform.update()
				} else if (velocity.x > 0 && // Moving right
					transform.x + transform.w > rect.left &&
					transform.x < rect.right &&
					transform.y + transform.h > rect.top &&
					transform.y < rect.bottom) {
					transform.x = rect.left - transform.w
					velocity.x = -Math.abs(velocity.x) // Reverse to left
					transform.update()
				}
			})
			
			// Check if about to walk off edge
			const aheadX = velocity.x < 0 ? transform.left - 5 : transform.right + 5
			const checkY = transform.bottom + 5
			const tilesAhead = tilemap.querySolids({ x: aheadX, y: checkY, w: 10, h: 10 })
			const groundAhead = tilesAhead.some(tile => 
				tile.rect.top <= checkY && 
				tile.rect.right > aheadX && 
				tile.rect.left < aheadX
			)
			
			if (!groundAhead && transform.grounded) {
				velocity.x = -velocity.x // Reverse direction at edge
			}
		})
		
		// Check for player-enemy collision (stomp detection)
		this._checkPlayerEnemyCollision(world)
	}
	
	_checkPlayerEnemyCollision(world) {
		const playerTransform = world.getComponent(world.resources.playerEntity, 'Transform')
		const playerVelocity = world.getComponent(world.resources.playerEntity, 'Velocity')
		
		const enemies = world.query(['Transform', 'Velocity', 'State', 'Collider'])
		
		enemies.forEach(entity => {
			const state = world.getComponent(entity.id, 'State')
			if (state.value === 'dead') return
			
			const enemyTransform = world.getComponent(entity.id, 'Transform')
			const enemyVelocity = world.getComponent(entity.id, 'Velocity')
			
			// Simple AABB collision
			if (playerTransform.x < enemyTransform.x + enemyTransform.w &&
				playerTransform.x + playerTransform.w > enemyTransform.x &&
				playerTransform.y < enemyTransform.y + enemyTransform.h &&
				playerTransform.y + playerTransform.h > enemyTransform.y) {
				
				// Check if player is falling and hits enemy from top (stomp)
				const playerBottom = playerTransform.y + playerTransform.h
				const enemyTop = enemyTransform.y
				const isStomp = playerVelocity.y > 0 && 
								playerBottom < enemyTransform.y + enemyTransform.h / 2 &&
								playerTransform.y < enemyTop
				
				if (isStomp) {
					// Kill enemy
					state.value = 'dead'
					enemyTransform.y = 1000 // Move off screen
					
					// Bounce player
					playerVelocity.y = -8
				} else {
					// Player gets hurt - for now just push back
					const pushDirection = playerTransform.x < enemyTransform.x ? -1 : 1
					playerVelocity.x = pushDirection * 5
					playerVelocity.y = -5
				}
			}
		})
	}
}
