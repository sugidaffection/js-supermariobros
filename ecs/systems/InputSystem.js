class InputSystem {
	constructor() {
		this.ready = false
	}

	bindEvents(world) {
		if (this.ready) return
		this.ready = true
		const keys = world.resources.input.keys
		document.addEventListener('keydown', (event) => {
			keys[event.keyCode] = true
		})
		document.addEventListener('keyup', (event) => {
			keys[event.keyCode] = false
		})
	}

	update(world) {
		this.bindEvents(world)
		const keys = world.resources.input.keys
		const entities = world.query(['Input', 'State'])
		entities.forEach(entity => {
			const input = world.getComponent(entity, 'Input')
			const state = world.getComponent(entity, 'State')
			input.up = !!keys[32]
			input.left = !!keys[37]
			input.right = !!keys[39]
			input.jumpPressed = !!keys[32]
			if (input.left) state.facing = 'left'
			if (input.right) state.facing = 'right'
		})
	}
}
