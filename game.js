const SKIN_WIDTH = 1

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

	play(){
		this.ctx.clearRect(0,0,this.w,this.h)
		this.tilemap.render(this.ctx)
		this.mario.render(this.ctx)
		if(this.loop){
			const dt = 1 / 60
			this.mario.update(dt)
			this.mario.ground = false
			const horizontalStep = this.mario.vel.x * dt

			if(this.mario.controller.right){
				if(this.tilemap.x < 1200 && this.mario.rect.right > this.w / 2){
					this.tilemap.update(horizontalStep)
					this.tilemap.x += 1
				}else{
					this.mario.rect.x += horizontalStep
				}
			}else if(this.mario.controller.left){
				if(this.mario.vel.x < 0){
					this.mario.rect.x += horizontalStep
				}
			}

			this.mario.rect.update()

			if(this.mario.rect.left < 0){
				this.mario.rect.x = 0
			}

			if(this.mario.rect.right > this.w){
				this.mario.rect.x = this.w - this.mario.rect.w
			}

			this.mario.rect.update()

			this.tilemap.solidsprites.forEach(obj => {
				if (this.mario.vel.x > 0 && overlapsOnY(this.mario.rect, obj.rect, SKIN_WIDTH) && this.mario.rect.right > obj.rect.left && this.mario.rect.left < obj.rect.left) {
					this.mario.rect.x = obj.rect.left - this.mario.rect.w
					this.mario.vel.x = 0
					this.mario.rect.update()
				} else if (this.mario.vel.x < 0 && overlapsOnY(this.mario.rect, obj.rect, SKIN_WIDTH) && this.mario.rect.left < obj.rect.right && this.mario.rect.right > obj.rect.right) {
					this.mario.rect.x = obj.rect.right
					this.mario.vel.x = 0
					this.mario.rect.update()
				}
			})

			const verticalStep = this.mario.vel.y * dt
			this.mario.rect.y += verticalStep
			this.mario.rect.update()

			this.tilemap.solidsprites.forEach(obj => {
				if (!intersects(this.mario.rect, obj.rect) || !overlapsOnX(this.mario.rect, obj.rect, SKIN_WIDTH)) {
					return
				}

				if (this.mario.vel.y > 0 && this.mario.rect.bottom > obj.rect.top && this.mario.rect.top < obj.rect.top) {
					this.mario.vel.y = 0
					this.mario.rect.y = obj.rect.top - this.mario.rect.h
					this.mario.ground = true
					this.mario.rect.update()
				} else if (this.mario.vel.y < 0 && this.mario.rect.top < obj.rect.bottom && this.mario.rect.bottom > obj.rect.bottom) {
					this.mario.rect.y = obj.rect.bottom
					this.mario.vel.y = 0
					this.mario.rect.update()
				}
			})

		}

		if(this.tilemap.x == 1200){
			this.win = true
		}

		if(this.win && this.idx == 0){
			this.idx = 1
			this.load_sound()
		}
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
	}

	run(s){
		this.scene.play()
		requestAnimationFrame((dt)=>this.run(s))
	}

}

document.addEventListener('DOMContentLoaded', () => {
	let game = new Game(600,448)
	game.run(0)
})
