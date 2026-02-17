class AnimationSystem {
	update(world) {
		const entities = world.query(['Transform', 'Velocity', 'Sprite', 'State', 'Input'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity.id, 'Transform')
			const velocity = world.getComponent(entity.id, 'Velocity')
			const sprite = world.getComponent(entity.id, 'Sprite')
			const state = world.getComponent(entity.id, 'State')
			const input = world.getComponent(entity.id, 'Input')

			sprite.flip = state.facing === 'left'
			if (!transform.grounded) {
				sprite.animation = 'jump'
				state.value = 'jump'
			} else if (!input.left && !input.right) {
				sprite.animation = 'idle'
				state.value = 'idle'
			} else if ((input.left && velocity.x > 0) || (input.right && velocity.x < 0)) {
				sprite.animation = 'turn'
				state.value = 'turn'
			} else {
				sprite.animation = 'walk'
				state.value = 'walk'
			}
		})
	}
}
