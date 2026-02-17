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

		this.controller = {
			up : false,
			right : false,
			left : false
		}

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

	update(dt){
		this.rect.update()

		this.acc = new Vector2(0, this.mass)
		
		if (this.controller.right){
			this.acc.x = this.speed
			this.flip = false
		}

		if (this.controller.left){
			this.acc.x = -this.speed
			this.flip = true
		}

		this.acc.add(this.vel.x * -this.frict, this.vel.y * this.grav)
		this.vel.add(this.acc.x * dt, this.acc.y * dt)

		if (this.ground && this.controller.up){
			this.vel.y = this.jump
			this.ground = false
		}

		if(!this.ground){
			if(this.vel.y < 0){
				this.setState(PlayerState.JUMP)
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

	keyEvent(){
		document.addEventListener('keydown', (e)=>{
			switch (e.keyCode) {
				case 32:
					this.controller.up = true
					break
				case 37:
					this.controller.left = true
					break
				case 39:
					this.controller.right = true
					break
				default:
					break
			}
		})

		document.addEventListener('keyup', (e)=>{
			switch (e.keyCode) {
				case 32:
					this.controller.up = false
					break
				case 37:
					this.controller.left = false
					break
				case 39:
					this.controller.right = false
					break
				default:
					break
			}
		})
	}

}
