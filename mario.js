class Mario {

	constructor(){
		const spritesheet = new Spritesheet('assets/character.png')
		const sprites = spritesheet
			.get_sprites(
				{
					idle : [
						[5,2.13,16,16]
					],
					walk : [
						[6.07,2.13,16,16],
						[7.15,2.13,16,16],
						[8.20,2.13,16,16]
					],
					turn : [
						[9.25,2.13,16,16]
					],
					jump : [
						[10.30,2.13,16,16]
					]
				}
			)

		this.spriteanimation = new SpriteAnimation(sprites)
		this.rect = new Rect(10,10*32,32,32)

		this.flip = false

		this.acc = new Vector2()
		this.vel = new Vector2()
		this.grav = .7
		this.frict = 1.6
		this.mass = 25
		this.speed = 8
		this.jump = -10
		this.state = PlayerState.IDLE
		this.ground = false
	}

	setState(nextState){
		if(this.state === nextState){
			return
		}
		this.state = nextState
	}

	getAnimation(){
		switch (this.state) {
			case PlayerState.RUN:
				return 'walk'
			case PlayerState.JUMP:
			case PlayerState.FALL:
				return 'jump'
			case PlayerState.TURN:
			case PlayerState.HURT:
				return 'turn'
			case PlayerState.IDLE:
			default:
				return 'idle'
		}
	}

	update(dt,input){
		this.rect.update()

		this.acc = new Vector2(0, this.mass)
		const movingRight = input.isDown(InputManager.ACTIONS.MOVE_RIGHT)
		const movingLeft = input.isDown(InputManager.ACTIONS.MOVE_LEFT)
		const jumping = input.isDown(InputManager.ACTIONS.JUMP)
		
		if (movingRight){
			this.acc.x = this.speed
			this.flip = false
		}

		if (movingLeft){
			this.acc.x = -this.speed
			this.flip = true
		}

		this.acc.add(this.vel.x * -this.frict, this.vel.y * this.grav)
		this.vel.add(this.acc.x * dt, this.acc.y * dt)

		if (this.ground && jumping){
			this.vel.y = this.jump
			this.ground = false
		}

		if(!this.ground){
			this.animation = 'jump'
		}else if(this.ground && !movingRight && !movingLeft){
			this.animation = 'idle'
		}else if(this.ground && (movingRight || movingLeft)){
			if((movingLeft && this.vel.x > 0) || (movingRight && this.vel.x < 0)){
				this.animation = 'turn'
			}else{
				this.setState(PlayerState.FALL)
			}
		}else if(!this.controller.right && !this.controller.left){
			this.setState(PlayerState.IDLE)
		}else if((this.controller.left && this.vel.x > 0) || (this.controller.right && this.vel.x < 0)){
			this.setState(PlayerState.TURN)
		}else{
			this.setState(PlayerState.RUN)
		}

		this.spriteanimation.speed = this.speed * dt
	}

	render(ctx){
		this.spriteanimation.play(ctx, this.getAnimation(), this.rect, this.flip)
	}

}
