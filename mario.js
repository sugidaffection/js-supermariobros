class Mario {

	constructor(){
		this.spritesheet = new Spritesheet('assets/character.png')
		this.sprites = this.spritesheet
			.add_sprites(
				{
					idle : [
						[80.5,34.5,15,15]
					],
					walk : [
						[97.5,34.5,15,15],
						[114.5,34.5,15,15],
						[131.5,34.5,15,15]
					],
					turn : [
						[148.5,34.5,15,15]
					],
					jump : [
						[165.5,34.5,15,15]
					]
				}
			)
			.scale(32,32)
			.pos(0,0)
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
		this.mass = 20
		this.speed = 8
		this.jump = -10
		this.animation = 'idle'
		this.idx = 0
		this.ground = false
		this.win = false
	}

	update(dt){
		this.sprites.update()

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

		if (this.sprites.rect.bottom >= 400){
			this.sprites.rect.bottom = 400
			this.vel.y = 0
			this.ground = true
		}

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

		this.sprites.rect.x += this.vel.x
		this.sprites.rect.y += this.vel.y

		this.idx += this.speed* dt
		if(Math.floor(this.idx) > this.sprites.length(this.animation) - 1){
			this.idx = 0
		}

		if(this.sprites.rect.x > 400){
			this.win = true
		}
	}

	render(ctx){
		this.sprites.draw(ctx,this.animation,Math.floor(this.idx),this.flip)
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