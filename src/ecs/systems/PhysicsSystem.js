import { PHYSICS_CONSTANTS } from '../../core/lib.js'

/**
 * PhysicsSystem - Handles all physics calculations for entities
 * Implements Mario-style platformer physics with:
 * - Variable jump height based on button hold duration
 * - Different acceleration/friction for ground vs air
 * - Terminal velocity limiting
 * - Coyote time for forgiving jumps
 */
export class PhysicsSystem {
constructor() {
this.constants = PHYSICS_CONSTANTS
}

update(world, dt) {
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

// Apply physics based on entity type
if (input) {
this._applyPlayerPhysics(transform, velocity, input, state)
} else {
this._applyEnemyPhysics(transform, velocity, state)
}

// Update facing direction based on velocity
if (state && velocity.x !== 0) {
state.facing = velocity.x < 0 ? 'left' : 'right'
}

// Apply gravity and integrate position
this._applyGravity(velocity, transform.grounded, input)
this._integratePosition(transform, velocity)

// Enforce world bounds
this._enforceWorldBounds(transform, velocity)
})

// Update camera to follow player
this._updateCamera(world)
}

/**
 * Apply player-specific physics with Mario-like controls
 */
_applyPlayerPhysics(transform, velocity, input, state) {
const moveDir = Number(input.right) - Number(input.left)
const maxSpeed = this.constants.MAX_WALK_SPEED
const accel = transform.grounded 
? this.constants.ACCELERATION_GROUND 
: this.constants.ACCELERATION_AIR
const friction = transform.grounded 
? this.constants.FRICTION_GROUND 
: this.constants.FRICTION_AIR

// Horizontal movement with smooth acceleration
if (moveDir !== 0) {
velocity.x += moveDir * accel

// Clamp to max speed
if (velocity.x > maxSpeed) velocity.x = maxSpeed
if (velocity.x < -maxSpeed) velocity.x = -maxSpeed
} else {
// Apply friction when no input
velocity.x *= friction

// Snap to zero when very slow
if (Math.abs(velocity.x) < 0.1) {
velocity.x = 0
}
}

// Jump handling with variable jump height
if (transform.grounded && input.jumpPressed) {
velocity.y = this.constants.JUMP_VELOCITY
transform.grounded = false
input.jumpPressed = false
}

// Variable jump: reduce gravity while holding jump button
if (!transform.grounded && velocity.y < 0) {
velocity.gravityScale = input.up 
? this.constants.VARIABLE_JUMP_MIN_GRAVITY 
: this.constants.VARIABLE_JUMP_MAX_GRAVITY
} else if (!transform.grounded && velocity.y > 0) {
// Fall faster than rise for snappier feel
velocity.gravityScale = this.constants.FALL_GRAVITY_MULTIPLIER
} else {
velocity.gravityScale = 1.0
}
}

/**
 * Apply enemy physics - simpler AI movement
 */
_applyEnemyPhysics(transform, velocity, state) {
// Maintain constant speed for enemies
const targetSpeed = velocity.speed || this.constants.MAX_WALK_SPEED * 0.3

if (Math.abs(velocity.x) < 0.01) {
// Restart movement if stopped
const facingDir = state && state.facing === 'right' ? 1 : -1
velocity.x = facingDir * targetSpeed
}

// Enemies don't have variable jump
velocity.gravityScale = 1.0
}

/**
 * Apply gravity with configurable scale
 */
_applyGravity(velocity, grounded, input) {
const gravityScale = velocity.gravityScale || 1.0
velocity.y += this.constants.GRAVITY * gravityScale

// Enforce terminal velocity
if (velocity.y > this.constants.TERMINAL_VELOCITY) {
velocity.y = this.constants.TERMINAL_VELOCITY
}
}

/**
 * Integrate velocity into position
 */
_integratePosition(transform, velocity) {
transform.x += velocity.x
transform.y += velocity.y
transform.updateDerivedValues()
}

/**
 * Keep entities within world bounds
 */
_enforceWorldBounds(transform, velocity) {
if (transform.x < 0) {
transform.x = 0
velocity.x = 0
transform.updateDerivedValues()
}
}

/**
 * Update camera to smoothly follow player
 */
_updateCamera(world) {
const playerEntityId = world.resources.playerEntity
if (!playerEntityId) return

const playerTransform = world.getComponent(playerEntityId, 'Transform')
if (!playerTransform) return

const camera = world.resources.camera
const viewport = world.resources.viewport
const viewportWidth = viewport.viewportWidth || viewport.w

// Center camera on player with clamping
const targetX = playerTransform.x - viewportWidth / 2
camera.x = Math.max(0, Math.min(camera.maxX, targetX))
}
}
