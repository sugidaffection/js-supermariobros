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
		this.gravity = 2200
		this.groundDrag = 14
		this.airDrag = 3
		this.moveAccel = 3200
		this.maxSpeed = 260
		this.jump = -700
		this.animation = 'turn'
		this.ground = false
		this.win = false
	}

	update(dt){
		this.rect.update()

		this.acc = new Vector2(0, this.gravity)

		if (this.controller.right){
			this.acc.x += this.moveAccel
			this.flip = false
		}

		if (this.controller.left){
			this.acc.x -= this.moveAccel
			this.flip = true
		}

		const drag = this.ground ? this.groundDrag : this.airDrag
		this.acc.x += -this.vel.x * drag

		this.vel.add(this.acc.x * dt, this.acc.y * dt)
		this.vel.x = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vel.x))

		if (this.ground && this.controller.up){
			this.vel.y = this.jump
			this.ground = false
		}

		if(!this.ground){
			this.animation = 'jump'
		}else if(this.ground && !this.controller.right && !this.controller.left){
			this.animation = 'idle'
		}else if(this.ground && (this.controller.right || this.controller.left)){
			if((this.controller.left && this.vel.x > 0) || (this.controller.right && this.vel.x < 0)){
				this.animation = 'turn'
			}else{
				this.animation = 'walk'
			}
		}

		this.spriteanimation.speed = Math.max(0.08, Math.abs(this.vel.x) * dt * 0.08)
	}

	render(ctx){
		this.spriteanimation.play(ctx, this.animation, this.rect, this.flip)
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
