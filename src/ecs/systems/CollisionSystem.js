import { PHYSICS_CONSTANTS } from '../../core/lib.js'

/**
 * CollisionSystem - Handles collision detection and resolution
 * Implements AABB collision with tilemap for platformer gameplay
 * Features:
 * - Separate axis resolution (Y first, then X)
 * - Grounded state tracking
 * - Skin width for tunneling prevention
 */
export class CollisionSystem {
constructor() {
this.skinWidth = PHYSICS_CONSTANTS.COLLISION_SKIN_WIDTH
}

update(world, scene) {
const tilemap = world.resources.tilemap
const entities = world.query(['Transform', 'Velocity', 'Collider'])

entities.forEach(entity => {
const transform = world.getComponent(entity.id, 'Transform')
const velocity = world.getComponent(entity.id, 'Velocity')
const collider = world.getComponent(entity.id, 'Collider')
const input = world.getComponent(entity.id, 'Input')
const state = world.getComponent(entity.id, 'State')

// Skip invalid or non-dynamic entities
if (!transform || !velocity || !collider) return
if (collider.type !== 'dynamic' || !collider.solid) return
if (state && state.value === 'dead') return

// Store previous position for collision detection
const prevX = transform.x
const prevY = transform.y

// Reset grounded state
transform.grounded = false

// Resolve vertical collisions first (important for platformers)
this._resolveVerticalCollisions(tilemap, transform, velocity, prevX, prevY)

// Then resolve horizontal collisions
this._resolveHorizontalCollisions(tilemap, transform, velocity, input, prevX, prevY)
})
}

/**
 * Resolve vertical collisions with tiles
 * Handles landing on platforms and hitting heads on ceilings
 */
_resolveVerticalCollisions(tilemap, transform, velocity, prevX, prevY) {
const nearbyTiles = tilemap.querySolids(transform)

for (const tile of nearbyTiles) {
const rect = tile.rect

// Check horizontal overlap first
const overlapsX = (transform.right - this.skinWidth) > rect.left && 
  (transform.left + this.skinWidth) < rect.right

if (!overlapsX) continue

// Landing on top of tile
if (velocity.y >= 0 && 
prevY + transform.h <= rect.top + this.skinWidth &&
transform.y + transform.h >= rect.top) {

velocity.y = 0
transform.y = rect.top - transform.h
transform.updateDerivedValues()
transform.grounded = true
}
// Hitting head on bottom of tile
else if (velocity.y < 0 && 
 prevY >= rect.bottom - this.skinWidth &&
 transform.y <= rect.bottom) {

transform.y = rect.bottom
transform.updateDerivedValues()
velocity.y = 0
}
}
}

/**
 * Resolve horizontal collisions with tiles
 * Handles walking into walls and enemy bouncing
 */
_resolveHorizontalCollisions(tilemap, transform, velocity, input, prevX, prevY) {
const nearbyTiles = tilemap.querySolids(transform)

for (const tile of nearbyTiles) {
const rect = tile.rect

// Check vertical overlap first
const overlapsY = (transform.bottom - this.skinWidth) > rect.top && 
  (transform.top + this.skinWidth) < rect.bottom

if (!overlapsY) continue

// Colliding from left side
if (velocity.x > 0 && 
prevX + transform.w <= rect.left + this.skinWidth &&
transform.x + transform.w >= rect.left) {

transform.x = rect.left - transform.w
transform.updateDerivedValues()

if (input) {
// Player stops at wall
velocity.x = 0
} else {
// Enemy bounces off wall
velocity.x = -Math.abs(velocity.x)
}
}
// Colliding from right side
else if (velocity.x < 0 && 
 prevX >= rect.right - this.skinWidth &&
 transform.x <= rect.right) {

transform.x = rect.right
transform.updateDerivedValues()

if (input) {
// Player stops at wall
velocity.x = 0
} else {
// Enemy bounces off wall
velocity.x = Math.abs(velocity.x)
}
}
}
}
}
