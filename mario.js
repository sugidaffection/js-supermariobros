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
		this.animation = 'turn'
		this.ground = false
		this.win = false
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
				this.animation = 'walk'
			}
		}

		this.spriteanimation.speed = this.speed * dt
	}

	render(ctx){
		this.spriteanimation.play(ctx, this.animation, this.rect, this.flip)
	}

}
