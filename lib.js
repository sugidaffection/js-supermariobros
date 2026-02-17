class Vector2 {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	add(x, y) {
		this.x += x
		this.y += y
		return this
	}

	copy() {
		return new Vector2(this.x, this.y)
	}
}

class Rect {
	constructor(x, y, w, h) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.update()
	}

	update() {
		this.top = this.y
		this.bottom = this.y + this.h
		this.left = this.x
		this.right = this.x + this.w
		this.centerx = this.left + this.w / 2
		this.centery = this.top + this.h / 2
	}

	intersects(other) {
		return this.left < other.right && this.right > other.left && this.top < other.bottom && this.bottom > other.top
	}

class InputManager {
	constructor() {
		this.actions = {
			jump: false,
			left: false,
			right: false
		}
		this._bind()
	}

	_bind() {
		document.addEventListener('keydown', (e) => this._set(e, true))
		document.addEventListener('keyup', (e) => this._set(e, false))
	}

	_set(e, value) {
		switch (e.keyCode) {
			case 32:
				this.actions.jump = value
				break
			case 37:
				this.actions.left = value
				break
			case 39:
				this.actions.right = value
				break
		}
	}
}

class StateMachine {
	constructor(initialState, transitions = {}, hooks = {}) {
		this.state = initialState
		this.transitions = transitions
		this.hooks = hooks
	}

	can(next) {
		return (this.transitions[this.state] || []).includes(next)
	}

	transition(next, payload) {
		if (!this.can(next)) {
			return false
		}
		const prev = this.state
		this.state = next
		if (this.hooks[next]) {
			this.hooks[next](prev, payload)
		}
		return true
	}
}
