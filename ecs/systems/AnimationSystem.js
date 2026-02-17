class AnimationSystem {
	update(world) {
		const entities = world.query(['Transform', 'Velocity', 'Sprite', 'State', 'Input'])
		entities.forEach(entity => {
			const transform = world.getComponent(entity, 'Transform')
			const velocity = world.getComponent(entity, 'Velocity')
			const sprite = world.getComponent(entity, 'Sprite')
			const state = world.getComponent(entity, 'State')
			const input = world.getComponent(entity, 'Input')

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
