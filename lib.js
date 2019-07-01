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

		this.top = this.y
		this.bottom = this.y + this.h
		this.left = this.x
		this.right = this.x + this.w

		this.centerx = this.left + this.w / 2
		this.centery = this.right + this.h / 2
		this.center = this.centerx, this.centery

		this.topleft = this.left, this.top
		this.topright = this.right, this.top
		this.bottomleft = this.left, this.bottom
		this.bottomright = this.right, this.bottom

		this.midleft = this.left, this.centery
		this.midright = this.right, this.centery
		this.midtop = this.centerx, this.top
		this.midbottom = this.centerx, this.bottom
	}

	update(){
		this.top = this.y
		this.bottom = this.y + this.h
		this.left = this.x
		this.right = this.x + this.w

		this.centerx = this.left + this.w / 2
		this.centery = this.right + this.h / 2
		this.center = this.centerx, this.centery

		this.topleft = this.left, this.top
		this.topright = this.right, this.top
		this.bottomleft = this.left, this.bottom
		this.bottomright = this.right, this.bottom

		this.midleft = this.left, this.centery
		this.midright = this.right, this.centery
		this.midtop = this.centerx, this.top
		this.midbottom = this.centerx, this.bottom
	}
}