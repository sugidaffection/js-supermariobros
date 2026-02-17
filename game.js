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

	bootstrapECS() {
		;['Transform', 'Velocity', 'Collider', 'Sprite', 'Input', 'State'].forEach(name => this.world.registerComponent(name))

		// Sprint 2: static collision grid now replaces ad-hoc tile collider loops.
		this.tilemap.buildCollisionGrid(this.world.resources.collisionGrid)

		// Sprint 1: Mario is now represented as an ECS entity.
		const marioEntity = this.world.createEntity()
		this.world.resources.playerEntity = marioEntity
		this.world.addComponent(marioEntity, 'Transform', ECSComponents.Transform(10, 10 * 32, 32, 32))
		this.world.addComponent(marioEntity, 'Velocity', ECSComponents.Velocity())
		this.world.addComponent(marioEntity, 'Collider', ECSComponents.Collider('dynamic', true))
		this.world.addComponent(marioEntity, 'Sprite', ECSComponents.Sprite('turn', false))
		this.world.addComponent(marioEntity, 'Input', ECSComponents.Input())
		this.world.addComponent(marioEntity, 'State', ECSComponents.State('turn'))

		const spritesheet = new Spritesheet('assets/character.png')
		const sprites = spritesheet.get_sprites({
			idle : [[5,2.13,16,16]],
			walk : [[6.07,2.13,16,16], [7.15,2.13,16,16], [8.20,2.13,16,16]],
			turn : [[9.25,2.13,16,16]],
			jump : [[10.30,2.13,16,16]],
		})
		this.world.resources.animations.set(marioEntity, new SpriteAnimation(sprites))

		this.world.addSystem(new InputSystem(), 1)
		this.world.addSystem(new PhysicsSystem(), 2)
		this.world.addSystem(new CollisionSystem(), 3)
		this.world.addSystem(new AnimationSystem(), 4)
		this.world.addSystem(new RenderSystem(), 5)
		// Sprint 3: win, audio and UI transitions are now state/resource-driven.
		this.world.addSystem(new AudioSystem(), 6)
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
