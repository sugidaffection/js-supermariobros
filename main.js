import { World } from './ecs.js'
import { Spritesheet, SpriteAnimation } from './spritesheet.js'
import { Tilemap } from './tilemap.js'
import { StaticCollisionGrid } from './ecs/staticCollisionGrid.js'
import { InputSystem } from './ecs/systems/InputSystem.js'
import { PhysicsSystem } from './ecs/systems/PhysicsSystem.js'
import { CollisionSystem } from './ecs/systems/CollisionSystem.js'
import { AnimationSystem } from './ecs/systems/AnimationSystem.js'
import { RenderSystem } from './ecs/systems/RenderSystem.js'
import { AudioSystem } from './ecs/systems/AudioSystem.js'
import { EnemySystem } from './ecs/systems/EnemySystem.js'
import { HUDSystem } from './ecs/systems/HUDSystem.js'
import { createMarioEntity, createEnemyEntities } from './mario.js'
import { Game, Scene } from './game.js'
import { Rect, StateMachine, Vector2, InputManager } from './lib.js'

// Expose to window for global access (since other files expect them globally)
window.World = World
window.Spritesheet = Spritesheet
window.SpriteAnimation = SpriteAnimation
window.Tilemap = Tilemap
window.StaticCollisionGrid = StaticCollisionGrid
window.InputSystem = InputSystem
window.PhysicsSystem = PhysicsSystem
window.CollisionSystem = CollisionSystem
window.AnimationSystem = AnimationSystem
window.RenderSystem = RenderSystem
window.AudioSystem = AudioSystem
window.EnemySystem = EnemySystem
window.HUDSystem = HUDSystem
window.createMarioEntity = createMarioEntity
window.createEnemyEntities = createEnemyEntities
window.Game = Game
window.Scene = Scene
window.Rect = Rect
window.StateMachine = StateMachine
window.Vector2 = Vector2
window.InputManager = InputManager

document.addEventListener('DOMContentLoaded', async () => {
	const game = new Game(600, 448)
	window.GameInstance = game
	await game.init()
	game.run(0)
})
