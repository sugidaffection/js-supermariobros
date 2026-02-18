const ECSComponents = {
	Transform: (x = 0, y = 0, w = 32, h = 32) => ({
		x,
		y,
		w,
		h,
		grounded: false,
	}),
	Velocity: (x = 0, y = 0, speed = 8, jump = -10, friction = 1.6, gravity = 0.7, mass = 25) => ({
		x,
		y,
		speed,
		jump,
		friction,
		gravity,
		mass,
	}),
	Collider: (type = 'dynamic', solid = true, gridX = 0, gridY = 0) => ({
		type,
		solid,
		gridX,
		gridY,
	}),
	Sprite: (animation = 'idle', flip = false) => ({
		animation,
		flip,
	}),
	Input: () => ({
		up: false,
		left: false,
		right: false,
		jumpPressed: false,
	}),
	State: (value = 'idle') => ({
		value,
		facing: 'right',
		won: false,
	}),
}
