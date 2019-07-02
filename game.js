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
		
		document.querySelector('#play').addEventListener('click', ()=>{
			document.querySelector('#play').style.display = 'none'
			document.querySelector('#game').style.display = 'grid'
			this.load_sound(true)
			this.loop = true
		})
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
			if(this.mario.rect.right > this.w / 2 && this.mario.controller.right && this.mario.x < 1200){
				this.tilemap.update(this.mario.vel.x)
			}else{
				this.mario.rect.x += this.mario.vel.x
			}

			if(this.mario.rect.left < 0){
				this.mario.rect.x = 0
			}

			if(this.mario.rect.right > this.w){
				this.mario.rect.x = this.w - this.mario.rect.w
			}

			this.tilemap.solidsprites.forEach(obj => {
				if(this.mario.rect.right > obj.rect.left && this.mario.rect.left < obj.rect.left ||
					this.mario.rect.left < obj.rect.right && this.mario.rect.right > obj.rect.right){
					if(this.mario.rect.bottom > obj.rect.top && this.mario.rect.top < obj.rect.top){
						this.mario.rect.y = obj.rect.top - this.mario.rect.h
						this.mario.vel.y = 0
						this.mario.ground = true
					}
				}
			})

			this.mario.rect.y += this.mario.vel.y

		}
		if(this.mario.win && this.idx == 0){
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