class Vector2 {
	constructor(x=0,y=0){
		this.x = x
		this.y = y
	}

	add(x, y){
		this.x += x
		this.y += y

		return this
	}
}

class Rect {

	constructor(x,y,w,h){
		this.x = x
		this.y = y
		this.w = w
		this.h = h

		this.update()
	}

	update(){
		this.top = this.y
		this.bottom = this.y + this.h
		this.left = this.x
		this.right = this.x + this.w

		this.centerx = this.left + this.w / 2
		this.centery = this.top + this.h / 2
		this.center = { x: this.centerx, y: this.centery }

		this.topleft = { x: this.left, y: this.top }
		this.topright = { x: this.right, y: this.top }
		this.bottomleft = { x: this.left, y: this.bottom }
		this.bottomright = { x: this.right, y: this.bottom }

		this.midleft = { x: this.left, y: this.centery }
		this.midright = { x: this.right, y: this.centery }
		this.midtop = { x: this.centerx, y: this.top }
		this.midbottom = { x: this.centerx, y: this.bottom }
	}

	overlapsX(other, inset=0){
		return this.left + inset < other.right && this.right - inset > other.left
	}

	overlapsY(other, inset=0){
		return this.top + inset < other.bottom && this.bottom - inset > other.top
	}

	intersects(other, inset=0){
		return this.overlapsX(other, inset) && this.overlapsY(other, inset)
	}

	willLandOn(other, dy, insetX=0){
		return this.bottom + dy > other.top &&
			this.top < other.top &&
			this.overlapsX(other, insetX)
	}

	willHitHeadOn(other, dy, insetX=0){
		return this.top + dy < other.bottom &&
			this.bottom > other.bottom &&
			this.overlapsX(other, insetX)
	}

	hitsLeftSideOf(other){
		return this.right > other.left &&
			this.left < other.left &&
			this.overlapsY(other)
	}

	hitsRightSideOf(other){
		return this.left < other.right &&
			this.right > other.right &&
			this.overlapsY(other)
		
	}

}
