export class InputSystem {
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
		const playerEntityId = world.resources.playerEntity
		if (!playerEntityId) return

		const input = world.getComponent(playerEntityId, 'Input')
		const state = world.getComponent(playerEntityId, 'State')
		if (!input || !state) return

		input.up = !!keys[32] || !!keys[38] // Space or Up
		input.left = !!keys[37]
		input.right = !!keys[39]
		input.jumpPressed = !!keys[32] || !!keys[38]

		if (input.left) state.facing = 'left'
		if (input.right) state.facing = 'right'
	}
}
