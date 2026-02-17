const SKIN_WIDTH = 1

class Scene {

	constructor(ctx,w,h){
		this.ctx = ctx
		this.w = w
		this.h = h
		this.tilemap = new Tilemap(w,h)
		this.loop = false
		this.music = [
			'assets/main_theme.mp3',
			'assets/level_complete.mp3'
		]
		this.sound = new Audio()
		this.sound.volume = 0.1

		this.world = this.createWorld()
		this.bootstrapECS()

		document.querySelector('#play').addEventListener('click', ()=>{
			document.querySelector('#play').style.display = 'none'
			document.querySelector('#game').style.display = 'grid'
			this.loop = true
			this.world.resources.game.loop = true
			if (!this.world.resources.audio.switchedToWinTheme) {
				this.sound.src = this.music[0]
				this.sound.loop = true
				this.sound.play()
			}
		})
	}

	createWorld() {
		const world = new World()
		world.resources.ctx = this.ctx
		world.resources.viewport = { w: this.w, h: this.h }
		world.resources.tilemap = this.tilemap
		world.resources.music = this.music
		world.resources.sound = this.sound
		world.resources.ui = { playButton: document.querySelector('#play') }
		world.resources.input = { keys: {} }
		world.resources.animations = new Map()
		world.resources.camera = { x: 0, maxX: 1200, viewportWidth: this.w }
		world.resources.collisionGrid = new StaticCollisionGrid(32)
		return world
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

			this.tilemap.solidsprites.forEach(obj => {
				if(this.mario.rect.willLandOn(obj.rect, this.mario.vel.y, 1)){
						this.mario.vel.y = 0
						this.mario.rect.y = obj.rect.top - this.mario.rect.h
						this.mario.ground = true
					}
				else if(this.mario.rect.willHitHeadOn(obj.rect, this.mario.vel.y, 1)){
						this.mario.rect.y = obj.rect.bottom
						this.mario.vel.y = 1
					}
				if(this.mario.rect.hitsLeftSideOf(obj.rect)){
						this.mario.rect.x = obj.rect.left - this.mario.rect.w
						this.mario.vel.x = 0
					}
				else if(this.mario.rect.hitsRightSideOf(obj.rect)){
						this.mario.rect.x = obj.rect.right
						this.mario.vel.x = 0
					}
			})

			this.mario.rect.y += this.mario.vel.y

	getMarioWorldRect(){
		return new Rect(
			this.mario.rect.x + this.tilemap.cameraX,
			this.mario.rect.y,
			this.mario.rect.w,
			this.mario.rect.h
		)
	}

	play(){
		if (this.loop) {
			this.world.update(1/60)
		} else {
			this.world.getStore('Transform') // keep world initialized
			new RenderSystem().update(this.world)
		}

		this.input.update()
	}

	stop(){
		this.loop = false
		this.world.resources.game.loop = false
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
