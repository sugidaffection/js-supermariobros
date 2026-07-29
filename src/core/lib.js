/**
 * Core Physics Constants for 2D Platformer
 * Tuned for Mario-like feel with precise controls
 */
export const PHYSICS_CONSTANTS = {
// Movement
MAX_WALK_SPEED: 4.5,
MAX_RUN_SPEED: 8.0,
ACCELERATION_GROUND: 0.15,
ACCELERATION_AIR: 0.08,
FRICTION_GROUND: 0.82,
FRICTION_AIR: 0.97,

// Jumping
JUMP_VELOCITY: -13.5,
VARIABLE_JUMP_MIN_GRAVITY: 0.5,
VARIABLE_JUMP_MAX_GRAVITY: 2.5,
FALL_GRAVITY_MULTIPLIER: 1.3,

// Gravity
GRAVITY: 0.65,
TERMINAL_VELOCITY: 15.0,

// Collision tolerance
COLLISION_SKIN_WIDTH: 2,
COYOTE_TIME_FRAMES: 6,
JUMP_BUFFER_FRAMES: 4
}

/**
 * 2D Vector utility class with common operations
 */
export class Vector2 {
constructor(x = 0, y = 0) {
this.x = x
this.y = y
}

set(x, y) {
this.x = x
this.y = y
return this
}

add(x, y) {
this.x += x
this.y += y
return this
}

subtract(x, y) {
this.x -= x
this.y -= y
return this
}

scale(scalar) {
this.x *= scalar
this.y *= scalar
return this
}

length() {
return Math.sqrt(this.x * this.x + this.y * this.y)
}

normalize() {
const len = this.length()
if (len > 0) {
this.x /= len
this.y /= len
}
return this
}

copy() {
return new Vector2(this.x, this.y)
}

static zero() {
return new Vector2(0, 0)
}
}

/**
 * Axis-Aligned Bounding Box for collision detection
 * Provides efficient rectangle intersection and containment tests
 */
export class Rect {
constructor(x, y, w, h) {
this.x = x
this.y = y
this.w = w
this.h = h
this.updateDerivedValues()
}

updateDerivedValues() {
this.top = this.y
this.bottom = this.y + this.h
this.left = this.x
this.right = this.x + this.w
this.centerX = this.x + this.w / 2
this.centerY = this.y + this.h / 2
}

setPosition(x, y) {
this.x = x
this.y = y
this.updateDerivedValues()
return this
}

setSize(w, h) {
this.w = w
this.h = h
this.updateDerivedValues()
return this
}

translate(dx, dy) {
this.x += dx
this.y += dy
this.updateDerivedValues()
return this
}

/**
 * Check intersection with another rectangle
 * Uses AABB collision detection algorithm
 */
intersects(other) {
return (
this.left < other.right &&
this.right > other.left &&
this.top < other.bottom &&
this.bottom > other.top
)
}

/**
 * Check if this rectangle fully contains another
 */
contains(other) {
return (
this.left <= other.left &&
this.right >= other.right &&
this.top <= other.top &&
this.bottom >= other.bottom
)
}

/**
 * Get overlap amounts with another rectangle
 * Returns null if no overlap
 */
getOverlap(other) {
if (!this.intersects(other)) return null

const overlapX = Math.min(
this.right - other.left,
other.right - this.left
)
const overlapY = Math.min(
this.bottom - other.top,
other.bottom - this.top
)

return { x: overlapX, y: overlapY }
}
}

/**
 * Finite State Machine for game state management
 * Supports transitions with hooks for side effects
 */
export class StateMachine {
constructor(initialState, transitions = {}, hooks = {}) {
this.state = initialState
this.transitions = transitions
this.hooks = hooks
}

can(nextState) {
const allowedTransitions = this.transitions[this.state] || []
return allowedTransitions.includes(nextState)
}

transition(nextState, payload = null) {
if (!this.can(nextState)) {
console.warn(`Invalid transition from ${this.state} to ${nextState}`)
return false
}

const prevState = this.state
this.state = nextState

if (this.hooks[nextState]) {
this.hooks[nextState](prevState, payload)
}

return true
}

reset(initialState) {
this.state = initialState
}
}
