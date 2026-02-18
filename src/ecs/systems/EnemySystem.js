export class EnemySystem {
	update(world) {
		const tilemap = world.resources.tilemap
		const playerEntityId = world.resources.playerEntity
		const entities = world.query(['Transform', 'Velocity', 'Collider', 'State'])
		
		entities.forEach(entity => {
			if (entity.id === playerEntityId) return
			if (world.getComponent(entity.id, 'Input')) return

			const state = world.getComponent(entity.id, 'State')
			if (!state || state.value !== 'walk') return
			
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const collider = world.getComponent(entity.id, 'Collider')
			if (!transform || !velocity || !collider) return
			
			if (collider.type !== 'dynamic' || !collider.solid) return
			if (velocity.x !== 0) {
				state.facing = velocity.x < 0 ? 'left' : 'right'
			}
			
			// Turn around when the tile ahead is missing.
			if (!transform.grounded) return
			const aheadX = velocity.x < 0 ? transform.left - 2 : transform.right + 2
			const probe = {
				x: aheadX - 1,
				y: transform.bottom + 1,
				w: 2,
				h: 6,
				left: aheadX - 1,
				right: aheadX + 1,
				top: transform.bottom + 1,
				bottom: transform.bottom + 7
			}
			const groundAhead = tilemap.querySolids(probe).some(tile => {
				const rect = tile.rect
				return rect.top < probe.bottom &&
					rect.bottom > probe.top &&
					rect.right > probe.left &&
					rect.left < probe.right
			})

			if (!groundAhead) {
				velocity.x = -velocity.x
			}
		})
		
		// Check for player-enemy collision (stomp detection)
		this._checkPlayerEnemyCollision(world)
	}
	
	_checkPlayerEnemyCollision(world) {
		const playerEntityId = world.resources.playerEntity
		if (!playerEntityId) return
		const playerTransform = world.getComponent(playerEntityId, 'Transform')
		const playerVelocity = world.getComponent(playerEntityId, 'Velocity')
		if (!playerTransform || !playerVelocity) return
		
		const enemies = world.query(['Transform', 'Velocity', 'State', 'Collider'])
		
		enemies.forEach(entity => {
			if (entity.id === playerEntityId) return
			if (world.getComponent(entity.id, 'Input')) return

			const state = world.getComponent(entity.id, 'State')
			const collider = world.getComponent(entity.id, 'Collider')
			if (!state || state.value === 'dead') return
			if (!collider || collider.type !== 'dynamic' || !collider.solid) return
			
			const enemyTransform = world.getComponent(entity.id, 'Transform')
			const enemyVelocity = world.getComponent(entity.id, 'Velocity')
			if (!enemyTransform || !enemyVelocity) return
			
			// Simple AABB collision
			if (playerTransform.x < enemyTransform.x + enemyTransform.w &&
				playerTransform.x + playerTransform.w > enemyTransform.x &&
				playerTransform.y < enemyTransform.y + enemyTransform.h &&
				playerTransform.y + playerTransform.h > enemyTransform.y) {
				
				// Check if player is falling and hits enemy from top (stomp)
				const playerBottom = playerTransform.y + playerTransform.h
				const stompHeight = enemyTransform.h * 0.4
				const isStomp = playerVelocity.y > 0 && 
								playerBottom <= enemyTransform.y + stompHeight
				
				if (isStomp) {
					// Kill enemy
					state.value = 'dead'
					enemyTransform.y = 1000 // Move off screen
					enemyTransform.update()
					enemyVelocity.x = 0
					enemyVelocity.y = 0
					
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
