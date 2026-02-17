class InputManager {
	static ACTIONS = {
		MOVE_LEFT: 'MOVE_LEFT',
		MOVE_RIGHT: 'MOVE_RIGHT',
		JUMP: 'JUMP',
		START: 'START',
		PAUSE: 'PAUSE'
	}

	constructor(target=document){
		this.target = target
		this.keysByCode = {
			ArrowLeft: InputManager.ACTIONS.MOVE_LEFT,
			ArrowRight: InputManager.ACTIONS.MOVE_RIGHT,
			Space: InputManager.ACTIONS.JUMP,
			Enter: InputManager.ACTIONS.START,
			Escape: InputManager.ACTIONS.PAUSE
		}
		this.down = new Set()
		this.pressed = new Set()

		this.target.addEventListener('keydown', this.onKeyDown.bind(this))
		this.target.addEventListener('keyup', this.onKeyUp.bind(this))
	}

	onKeyDown(event){
		const action = this.keysByCode[event.code]
		if (!action){
			return
		}

		if (!this.down.has(action)){
			this.pressed.add(action)
		}
		this.down.add(action)
	}

	onKeyUp(event){
		const action = this.keysByCode[event.code]
		if (!action){
			return
		}
		this.down.delete(action)
	}

	isDown(action){
		return this.down.has(action)
	}

	wasPressed(action){
		return this.pressed.has(action)
	}

	update(){
		this.pressed.clear()
	}
}
