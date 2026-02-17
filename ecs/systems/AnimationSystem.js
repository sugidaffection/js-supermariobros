export class AnimationSystem {
	update(world) {
		const entities = world.query(['Transform', 'Velocity', 'Sprite', 'State', 'Input'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const sprite = world.getComponent(entity.id, 'Sprite')
			const state = world.getComponent(entity.id, 'State')
			const input = world.getComponent(entity.id, 'Input')
			const animation = world.resources.animations.get(entity.id)

			if (!animation || !animation.sprites) return
			if (state.value === 'dead') return // Skip dead enemies

			const availableSprites = Object.keys(animation.sprites)
			const isPlayer = availableSprites.includes('idle')

			sprite.flip = state.facing === 'left'

			if (!transform.grounded) {
				if (availableSprites.includes('jump')) {
					sprite.animation = 'jump'
					state.value = 'jump'
				}
			} else if (isPlayer) {
				// Player animation based on input and velocity
				const isMoving = Math.abs(velocity.x) > 0.5
				if (isMoving) {
					if (availableSprites.includes('walk')) {
						sprite.animation = 'walk'
						state.value = 'walk'
					}
				} else {
					if (availableSprites.includes('idle')) {
						sprite.animation = 'idle'
						state.value = 'idle'
					}
				}
			} else {
				// Enemy animation - always walk if moving
				if (Math.abs(velocity.x) > 0.1) {
					if (availableSprites.includes('walk')) {
						sprite.animation = 'walk'
						state.value = 'walk'
					}
				} else {
					if (availableSprites.includes('idle')) {
						sprite.animation = 'idle'
						state.value = 'idle'
					}
				}
			}
		})
	}
}
