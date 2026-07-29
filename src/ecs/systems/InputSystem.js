export class InputSystem {
	constructor() {
		this.ready = false
	}

	bindEvents(world) {
		if (this.ready) return
		this.ready = true
		const keys = world.resources.input.keys
		document.addEventListener('keydown', (event) => {
			keys[event.code] = true
		})
		document.addEventListener('keyup', (event) => {
			keys[event.code] = false
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

		// Support Arrow keys, WASD, and Space for jump
		const jumpDown = !!keys['Space'] || !!keys['ArrowUp'] || !!keys['KeyW']
		input.jumpPressed = jumpDown && !input.up
		input.up = jumpDown
		input.left = !!keys['ArrowLeft'] || !!keys['KeyA']
		input.right = !!keys['ArrowRight'] || !!keys['KeyD']

		if (input.left) state.facing = 'left'
		if (input.right) state.facing = 'right'
	}
}
