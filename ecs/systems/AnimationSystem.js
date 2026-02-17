class AnimationSystem {
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

			const availableSprites = Object.keys(animation.sprites)
			const isPlayer = availableSprites.includes('idle')

			sprite.flip = state.facing === 'left'

			if (!transform.grounded) {
				if (availableSprites.includes('jump')) {
					sprite.animation = 'jump'
					state.value = 'jump'
				}
			} else if (!input.left && !input.right) {
				if (availableSprites.includes('idle')) {
					sprite.animation = 'idle'
					state.value = 'idle'
				} else if (availableSprites.includes('walk')) {
					sprite.animation = 'walk'
					state.value = 'walk'
				}
			} else if ((input.left && velocity.x > 0) || (input.right && velocity.x < 0)) {
				if (availableSprites.includes('turn')) {
					sprite.animation = 'turn'
					state.value = 'turn'
				} else if (availableSprites.includes('walk')) {
					sprite.animation = 'walk'
					state.value = 'walk'
				}
			} else {
				if (availableSprites.includes('walk')) {
					sprite.animation = 'walk'
					state.value = 'walk'
				} else if (availableSprites.includes('idle')) {
					sprite.animation = 'idle'
					state.value = 'idle'
				}
			}
		})
	}
}
