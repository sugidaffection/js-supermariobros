class Scene {
	constructor(ctx, w, h, mapData) {
		this.ctx = ctx
		this.w = w
		this.h = h
		this.input = new InputManager()
		this.world = new World()
		this.tilemap = new Tilemap(w, h, mapData['1_1'])
		this.cameraX = 0
		this.music = ['assets/main_theme.mp3', 'assets/level_complete.mp3']
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

		this.playerEntity = createMarioEntity(this.world, new Spritesheet('assets/character.png'))
		createEnemyEntities(this.world, new Spritesheet('assets/enemies.png'), mapData['1_1'].enemies)
		this._registerSystems()
		this._bindPlayButton()
	}

	_bindPlayButton() {
		document.querySelector('#play').addEventListener('click', () => {
			document.querySelector('#play').style.display = 'none'
			document.querySelector('#game').style.display = 'grid'
			this.gameFsm.transition('running')
		})
	}

	_playTrack(idx, loop) {
		this.sound.src = this.music[idx]
		this.sound.loop = loop
		this.sound.play()
	}

	_registerSystems() {
		this.world.addSystem({
			stage: 'update',
			run: (world, { dt, input, scene }) => {
				if (scene.gameFsm.state !== 'running') {
					return
				}
				world.query(['tag', 'transform', 'physics']).forEach(({ components }) => {
					const isPlayer = components.tag.type === 'player'
					const rect = components.transform.rect
					const body = components.physics
					body.acc.x = 0
					body.acc.y = body.gravity

					if (isPlayer) {
						if (input.right) {
							body.acc.x = body.speed
							components.transform.flip = false
						}
						if (input.left) {
							body.acc.x = -body.speed
							components.transform.flip = true
						}
						if (body.grounded && input.jump) {
							body.vel.y = body.jump
							body.grounded = false
						}
					} else {
						body.acc.x = body.vel.x
					}

					body.vel.x += (body.acc.x - body.drag * body.vel.x) * dt
					body.vel.y += body.acc.y * dt
					this._resolveAxis(rect, body, 'x', dt)
					this._resolveAxis(rect, body, 'y', dt)
				})
			}
		})

		this.world.addSystem({
			stage: 'update',
			run: (world, { scene }) => {
				const player = world.entities.get(scene.playerEntity)
				const rect = player.transform.rect
				scene.cameraX = Math.max(0, Math.min(rect.centerx - scene.w / 2, scene.tilemap.levelWidthPx - scene.w))
				if (rect.right >= scene.tilemap.levelWidthPx - 64) {
					scene.gameFsm.transition('win')
				}

				const moving = Math.abs(player.physics.vel.x) > 0.5
				if (!player.physics.grounded) {
					player.fsm.transition('jump')
				} else if (!moving) {
					player.fsm.transition('idle')
				} else if ((player.transform.flip && player.physics.vel.x > 0) || (!player.transform.flip && player.physics.vel.x < 0)) {
					player.fsm.transition('turn')
				} else {
					player.fsm.transition('run')
				}
				player.sprite.state = player.fsm.state
			}
		})

		this.world.addSystem({
			stage: 'render',
			run: (world, { ctx, scene }) => {
				scene.tilemap.render(ctx, scene.cameraX)
				world.query(['transform', 'sprite']).forEach(({ components }) => {
					components.sprite.animation.speed = 0.2
					components.sprite.animation.play(
						ctx,
						components.sprite.state,
						{ x: components.transform.rect.x - scene.cameraX, y: components.transform.rect.y, w: components.transform.rect.w, h: components.transform.rect.h },
						components.transform.flip
					)
				})
			}
		})
	}

	_resolveAxis(rect, body, axis, dt) {
		const isX = axis === 'x'
		if (isX) {
			rect.x += body.vel.x * dt * 60
		} else {
			rect.y += body.vel.y * dt
			body.grounded = false
		}
		rect.update()

		const potentials = this.tilemap.querySolids(rect)
		potentials.forEach((tile) => {
			if (!rect.intersects(tile.rect)) {
				return
			}
			if (isX) {
				if (body.vel.x > 0) {
					rect.x = tile.rect.left - rect.w
				} else if (body.vel.x < 0) {
					rect.x = tile.rect.right
				}
				body.vel.x = 0
			} else {
				if (body.vel.y > 0) {
					rect.y = tile.rect.top - rect.h
					body.grounded = true
				} else if (body.vel.y < 0) {
					rect.y = tile.rect.bottom
				}
				body.vel.y = 0
			}
			rect.update()
		})

		if (rect.left < 0) {
			rect.x = 0
			body.vel.x = 0
			rect.update()
		}
	}

	update(dt) {
		this.world.run('update', { dt, input: this.input.actions, scene: this })
	}

	render() {
		this.ctx.clearRect(0, 0, this.w, this.h)
		this.world.run('render', { ctx: this.ctx, scene: this })
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
		const response = await fetch('assets/map.json')
		const mapData = await response.json()
		this.scene = new Scene(this.ctx, this.w, this.h, mapData)
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
