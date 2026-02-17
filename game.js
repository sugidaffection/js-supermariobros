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
			this.mario.update(1/60)
			if(this.mario.controller.right){
				if(this.tilemap.x < 1200 && this.mario.rect.right > this.w / 2){
					this.tilemap.update(this.mario.vel.x)
					this.tilemap.x += 1
				}else{
					this.mario.rect.x += this.mario.vel.x
				}
			}else if(this.mario.controller.left){
				if(this.mario.vel.x < 0){
					this.mario.rect.x += this.mario.vel.x
				}
			}

			if(this.mario.rect.left < 0){
				this.mario.rect.x = 0
			}

			if(this.mario.rect.right > this.w){
				this.mario.rect.x = this.w - this.mario.rect.w
			}

			// Reset grounded state before collision checks so Mario can't
			// keep jumping after walking off an edge.
			this.mario.ground = false

			this.tilemap.solidsprites.forEach(obj => {
				if(this.mario.rect.bottom + this.mario.vel.y > obj.rect.top &&
					this.mario.rect.top < obj.rect.top &&
					this.mario.rect.left + 1 < obj.rect.right &&
					this.mario.rect.right - 1 > obj.rect.left){
						this.mario.vel.y = 0
						this.mario.rect.y = obj.rect.top - this.mario.rect.h
						this.mario.ground = true
					}
				else if(this.mario.rect.top + this.mario.vel.y < obj.rect.bottom &&
					this.mario.rect.bottom > obj.rect.bottom &&
					this.mario.rect.left + 1 < obj.rect.right &&
					this.mario.rect.right - 1 > obj.rect.left){
						this.mario.rect.y = obj.rect.bottom
						this.mario.vel.y = 1
					}
				if(this.mario.rect.right > obj.rect.left &&
					this.mario.rect.left < obj.rect.left &&
					this.mario.rect.top < obj.rect.bottom &&
					this.mario.rect.bottom > obj.rect.top){
						this.mario.rect.x = obj.rect.left - this.mario.rect.w
						this.mario.vel.x = 0
					}
				else if(this.mario.rect.left < obj.rect.right &&
					this.mario.rect.right > obj.rect.right &&
					this.mario.rect.top < obj.rect.bottom &&
					this.mario.rect.bottom > obj.rect.top){
						this.mario.rect.x = obj.rect.right
						this.mario.vel.x = 0
					}
			})

			this.mario.rect.y += this.mario.vel.y

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
