import { Rect } from '../core/lib.js'
import { SpriteAnimation } from '../core/spritesheet.js'
import { PHYSICS_CONSTANTS } from '../core/lib.js'

/**
 * Create Mario player entity with proper physics configuration
 */
export function createMarioEntity(world, spritesheet) {
const sprites = spritesheet.get_sprites({
idle: [[5, 2.13, 16, 16]],
walk: [[6.07, 2.13, 16, 16], [7.15, 2.13, 16, 16], [8.2, 2.13, 16, 16]],
turn: [[9.25, 2.13, 16, 16]],
jump: [[10.3, 2.13, 16, 16]]
})

const entityId = world.createEntity({
Transform: new Rect(96, 320, 32, 32),
Velocity: { 
x: 0, 
y: 0, 
speed: PHYSICS_CONSTANTS.MAX_WALK_SPEED, 
jump: PHYSICS_CONSTANTS.JUMP_VELOCITY, 
friction: PHYSICS_CONSTANTS.FRICTION_GROUND, 
gravity: PHYSICS_CONSTANTS.GRAVITY, 
mass: 1,
gravityScale: 1.0
},
Collider: { type: 'dynamic', solid: true, gridX: 0, gridY: 0 },
Sprite: { animation: 'idle', flip: false },
Input: { up: false, left: false, right: false, jumpPressed: false },
State: { value: 'idle', facing: 'right', won: false }
})

world.getComponent(entityId, 'Transform').grounded = false
world.resources.playerEntity = entityId
world.resources.animations.set(entityId, new SpriteAnimation(sprites))

return entityId
}

/**
 * Create enemy entities (Goombas) with AI behavior
 */
export function createEnemyEntities(world, spriteSheet, mapEnemies) {
mapEnemies.forEach((enemyDef) => {
const sprites = spriteSheet.get_sprites({
walk: [[0, 1, 16, 16], [1, 1, 16, 16]]
})

enemyDef.position.forEach((pos) => {
const entityId = world.createEntity({
Transform: new Rect(pos[0] * 32, pos[1] * 32, 32, 32),
Velocity: { 
x: -1.4, 
y: 0, 
speed: 1.4, 
friction: 0, 
gravity: PHYSICS_CONSTANTS.GRAVITY, 
mass: 1,
gravityScale: 1.0
},
Collider: { type: 'dynamic', solid: true, gridX: 0, gridY: 0 },
Sprite: { animation: 'walk', flip: true },
State: { value: 'walk', facing: 'left', won: false }
})

world.getComponent(entityId, 'Transform').grounded = false
world.resources.animations.set(entityId, new SpriteAnimation(sprites))
})
})
}
