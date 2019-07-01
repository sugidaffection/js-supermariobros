class Scene {

	constructor(ctx,w,h){
		this.ctx = ctx
		this.w = w
		this.h = h
		this.mario = new Mario()
		this.mario.keyEvent()
		this.loop = true
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
		})
	}

	load_sound(loop=false){
		this.sound.src = this.music[this.idx]
		this.sound.loop = loop
		this.sound.play()
	}

	play(){
		this.ctx.clearRect(0,0,this.w,this.h)
		this.mario.render(this.ctx)
		if(this.loop){
			this.mario.update(1/60)
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
	let game = new Game(600,480)
	game.run(0)
})