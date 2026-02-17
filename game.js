const SKIN_WIDTH = 1

class Scene {
	constructor(ctx, w, h, mapData) {
		this.ctx = ctx
		this.w = w
		this.h = h
		this.world = new World()
		this.tilemap = new Tilemap(w, h, mapData['1_1'])
		this.cameraX = 0
		this.music = ['/main_theme.mp3', '/level_complete.mp3']
		this.sound = new Audio()
		this.sound.volume = 0.1

		this.gameFsm = new StateMachine('start', {
			start: ['running'],
			running: ['win'],
			win: []
		}, {
			running: () => this._playTrack(0, true),
			win: () => this._playTrack(1, false)
		})

		this._initWorldResources()
		this.playerEntity = createMarioEntity(this.world, new Spritesheet('/character.png'))
		createEnemyEntities(this.world, new Spritesheet('/enemies.png'), mapData['1_1'].enemies)
		this._registerSystems()
		this._bindPlayButton()
	}

	_initWorldResources() {
		this.world.resources = {
			ctx: this.ctx,
			viewport: { w: this.w, h: this.h, viewportWidth: this.w },
			camera: { x: 0, maxX: this.tilemap.levelWidthPx - this.w },
			tilemap: this.tilemap,
			input: { keys: {} },
			playerEntity: null,
			game: { loop: true },
			ui: { playButton: document.querySelector('#play') },
			music: this.music,
			sound: this.sound,
			audio: { switchedToWinTheme: false },
			collisionGrid: new StaticCollisionGrid(32),
			animations: new Map(),
			time: { dt: 1 / 60 }
		}
		this.tilemap.populateCollisionGrid(this.world.resources.collisionGrid)
	}

	_bindPlayButton() {
		document.querySelector('#play').addEventListener('click', () => {
			document.querySelector('#play').style.display = 'none'
			document.querySelector('#game').style.display = 'block'
			this.gameFsm.transition('running')
		})
	}

	_playTrack(idx, loop) {
		this.sound.src = this.music[idx]
		this.sound.loop = loop
		this.sound.play()
	}

	_registerSystems() {
		const inputSystem = new InputSystem()
		const physicsSystem = new PhysicsSystem()
		const collisionSystem = new CollisionSystem()
		const animationSystem = new AnimationSystem()
		const renderSystem = new RenderSystem()
		const audioSystem = new AudioSystem()

		this.world.addSystem({
			stage: 'update',
			run: (world, context) => {
				inputSystem.update(world)
			}
		})

		this.world.addSystem({
			stage: 'update',
			run: (world, context) => {
				if (this.gameFsm.state !== 'running') return
				physicsSystem.update(world, context.dt)
			}
		})

		this.world.addSystem({
			stage: 'update',
			run: (world, context) => {
				if (this.gameFsm.state !== 'running') return
				collisionSystem.update(world, this)
			}
		})

		this.world.addSystem({
			stage: 'update',
			run: (world, context) => {
				if (this.gameFsm.state !== 'running') return
				animationSystem.update(world)
			}
		})

		this.world.addSystem({
			stage: 'update',
			run: (world, context) => {
				audioSystem.update(world)
			}
		})

		this.world.addSystem({
			stage: 'render',
			run: (world, context) => {
				renderSystem.update(world)
			}
		})
	}

	update(dt) {
		this.world.resources.time.dt = dt
		this.world.resources.camera.x = this.cameraX
		this.world.run('update', { dt })
	}

	render() {
		this.ctx.clearRect(0, 0, this.w, this.h)
		this.world.run('render', {})
	}
}

class Game {
	constructor(w, h) {
		const canvas = document.querySelector('#game')
		canvas.width = w
		canvas.height = h
		canvas.style.border = '1px solid #000'
		this.ctx = canvas.getContext('2d')
		this.w = w
		this.h = h
		this.scene = null
		this.accumulator = 0
		this.last = 0
		this.step = 1 / 60
	}

	async init() {
		const response = await fetch('/map.json')
		const mapData = await response.json()
		this.scene = new Scene(this.ctx, this.w, this.h, mapData)
		
		// Wait for all images to load
		await this._waitForImages()
	}

	async _waitForImages() {
		const spritesheets = [
			this.scene.tilemap.tilesheet,
			...this.scene.world.entities.values()
				.filter(e => e.Sprite && e.Sprite.animation)
				.map(e => e.Sprite.animation.sprites)
		].flat()
		
		const promises = spritesheets
			.filter(s => s instanceof Spritesheet)
			.map(s => s.waitForLoad())
		
		await Promise.all(promises)
		console.log('All images loaded')
	}

	run = (timeMs = 0) => {
		if (!this.scene) {
			requestAnimationFrame(this.run)
			return
		}
		const now = timeMs / 1000
		const frame = Math.min(0.25, now - this.last)
		this.last = now
		this.accumulator += frame
		while (this.accumulator >= this.step) {
			this.scene.update(this.step)
			this.accumulator -= this.step
		}
		this.scene.render()
		requestAnimationFrame(this.run)
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	const game = new Game(600, 448)
	await game.init()
	game.run(0)
})
