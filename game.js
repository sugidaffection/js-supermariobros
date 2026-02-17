class Scene {

	constructor(ctx,w,h){
		this.ctx = ctx
		this.w = w
		this.h = h
		this.tilemap = null
		this.ready = false
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
		this.loadLevel()
	}

	async loadLevel(){
		this.tilemap = await Tilemap.fromJSON(this.w, this.h, '1_1')
		this.ready = true
	}

	load_sound(loop=false){
		this.sound.src = this.music[this.idx]
		this.sound.loop = loop
		this.sound.play()
	}

	getMarioWorldRect(){
		return new Rect(
			this.mario.rect.x + this.tilemap.cameraX,
			this.mario.rect.y,
			this.mario.rect.w,
			this.mario.rect.h
		)
	}

	play(){
		this.ctx.clearRect(0,0,this.w,this.h)
		if(!this.ready){
			return
		}

		this.tilemap.render(this.ctx)
		this.mario.render(this.ctx)
		if(this.loop){
			this.mario.update(1/60)
			if(this.mario.controller.right){
				if(this.mario.rect.right > this.w / 2){
					this.tilemap.setCameraX(this.tilemap.cameraX + this.mario.vel.x)
				}else{
					this.mario.rect.x += this.mario.vel.x
				}
			}else if(this.mario.controller.left){
				if(this.mario.vel.x < 0){
					if(this.tilemap.cameraX > 0 && this.mario.rect.left <= this.w / 2){
						this.tilemap.setCameraX(this.tilemap.cameraX + this.mario.vel.x)
					}else{
						this.mario.rect.x += this.mario.vel.x
					}
				}
			}

			if(this.mario.rect.left < 0){
				this.mario.rect.x = 0
			}

			if(this.mario.rect.right > this.w){
				this.mario.rect.x = this.w - this.mario.rect.w
			}

			const marioWorldRect = this.getMarioWorldRect()
			const nearbySolids = this.tilemap.querySolidsByWorldRect(marioWorldRect)

			nearbySolids.forEach(obj => {
				if(marioWorldRect.bottom + this.mario.vel.y > obj.worldRect.top &&
					marioWorldRect.top < obj.worldRect.top &&
					marioWorldRect.left + 1 < obj.worldRect.right &&
					marioWorldRect.right - 1 > obj.worldRect.left){
						this.mario.vel.y = 0
						this.mario.rect.y = obj.worldRect.top - this.mario.rect.h
						this.mario.ground = true
				}
				else if(marioWorldRect.top + this.mario.vel.y < obj.worldRect.bottom &&
					marioWorldRect.bottom > obj.worldRect.bottom &&
					marioWorldRect.left + 1 < obj.worldRect.right &&
					marioWorldRect.right - 1 > obj.worldRect.left){
						this.mario.rect.y = obj.worldRect.bottom
						this.mario.vel.y = 1
				}
				if(marioWorldRect.right > obj.worldRect.left &&
					marioWorldRect.left < obj.worldRect.left &&
					marioWorldRect.top < obj.worldRect.bottom &&
					marioWorldRect.bottom > obj.worldRect.top){
						const screenX = obj.worldRect.left - this.tilemap.cameraX
						this.mario.rect.x = screenX - this.mario.rect.w
						this.mario.vel.x = 0
				}
				else if(marioWorldRect.left < obj.worldRect.right &&
					marioWorldRect.right > obj.worldRect.right &&
					marioWorldRect.top < obj.worldRect.bottom &&
					marioWorldRect.bottom > obj.worldRect.top){
						const screenX = obj.worldRect.right - this.tilemap.cameraX
						this.mario.rect.x = screenX
						this.mario.vel.x = 0
				}
			})

			this.mario.rect.y += this.mario.vel.y
		}

		const marioWorldX = this.mario.rect.centerx + this.tilemap.cameraX
		if(this.tilemap.isObjectiveReached('win', marioWorldX)){
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
