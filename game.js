class Scene {

	constructor(ctx,w,h){
		this.ctx = ctx
		this.w = w
		this.h = h
		this.tilemap = new Tilemap(w,h)
		this.mario = new Mario()
		this.mario.keyEvent()
		this.loop = false
		this.music = [
			'assets/main_theme.mp3',
			'assets/level_complete.mp3'
		]
		this.idx = 0
		this.sound = new Audio()
		this.sound.volume = 0.1
		
		document.querySelector('#play').addEventListener('click', ()=>{
			document.querySelector('#play').style.display = 'none'
			document.querySelector('#game').style.display = 'grid'
			this.load_sound(true)
			this.loop = true
		})

		this.win = false
	}

	load_sound(loop=false){
		this.sound.src = this.music[this.idx]
		this.sound.loop = loop
		this.sound.play()
	}

	update(dt){
		if(!this.loop){
			return
		}

		this.mario.update(dt)
		const movingRight = this.mario.controller.right && this.mario.vel.x > 0
		const shouldScrollWorld = movingRight && this.tilemap.x < 1200 && this.mario.rect.right > this.w / 2

		if(shouldScrollWorld){
			const worldDelta = Math.min(this.mario.vel.x * dt, 1200 - this.tilemap.x)
			this.tilemap.update(worldDelta)
			this.tilemap.x += worldDelta
		}else{
			this.mario.rect.x += this.mario.vel.x * dt
		}

		this.mario.rect.update()
		this.resolveHorizontalCollisions()

		this.mario.ground = false
		this.mario.rect.y += this.mario.vel.y * dt
		this.mario.rect.update()
		this.resolveVerticalCollisions()

		if(this.mario.rect.left < 0){
			this.mario.rect.x = 0
		}

		if(this.mario.rect.right > this.w){
			this.mario.rect.x = this.w - this.mario.rect.w
		}
		this.mario.rect.update()

		if(this.tilemap.x >= 1200){
			this.win = true
		}

		if(this.win && this.idx === 0){
			this.idx = 1
			this.load_sound()
		}
	}

	resolveHorizontalCollisions(){
		this.tilemap.solidsprites.forEach(obj => {
			if(this.mario.rect.right > obj.rect.left &&
				this.mario.rect.left < obj.rect.right &&
				this.mario.rect.bottom > obj.rect.top &&
				this.mario.rect.top < obj.rect.bottom){
				if(this.mario.vel.x > 0){
					this.mario.rect.x = obj.rect.left - this.mario.rect.w
				}else if(this.mario.vel.x < 0){
					this.mario.rect.x = obj.rect.right
				}
				this.mario.vel.x = 0
				this.mario.rect.update()
			}
		})
	}

	resolveVerticalCollisions(){
		this.tilemap.solidsprites.forEach(obj => {
			if(this.mario.rect.right - 1 > obj.rect.left &&
				this.mario.rect.left + 1 < obj.rect.right &&
				this.mario.rect.bottom > obj.rect.top &&
				this.mario.rect.top < obj.rect.bottom){
				if(this.mario.vel.y > 0){
					this.mario.rect.y = obj.rect.top - this.mario.rect.h
					this.mario.vel.y = 0
					this.mario.ground = true
				}else if(this.mario.vel.y < 0){
					this.mario.rect.y = obj.rect.bottom
					this.mario.vel.y = 0
				}
				this.mario.rect.update()
			}
		})
	}

	render(interpolationAlpha=0){
		void interpolationAlpha
		this.ctx.clearRect(0,0,this.w,this.h)
		this.tilemap.render(this.ctx)
		this.mario.render(this.ctx)
	}

	play(interpolationAlpha=0){
		this.render(interpolationAlpha)
	}

	stop(){
		this.loop = false
	}

}

class Game {

	constructor(w,h){
		const canvas = document.querySelector('#game')
		canvas.width = w
		canvas.height = h
		canvas.style.border = '1px solid #000'
		const ctx = canvas.getContext('2d')
		this.scene = new Scene(ctx,w,h)
		this.lastTime = null
		this.accumulator = 0
		this.fixedDt = 1 / 60
		this.maxFrameDelta = 0.25
	}

	run(timestamp){
		const now = timestamp / 1000
		if(this.lastTime === null){
			this.lastTime = now
		}

		let frameDelta = now - this.lastTime
		this.lastTime = now
		frameDelta = Math.min(frameDelta, this.maxFrameDelta)
		this.accumulator += frameDelta

		while(this.accumulator >= this.fixedDt){
			this.scene.update(this.fixedDt)
			this.accumulator -= this.fixedDt
		}

		const interpolationAlpha = this.accumulator / this.fixedDt
		this.scene.render(interpolationAlpha)

		requestAnimationFrame((dt)=>this.run(dt))
	}

}

document.addEventListener('DOMContentLoaded', () => {
	const game = new Game(600,448)
	requestAnimationFrame((dt)=>game.run(dt))
})
