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

class Collider{

	constructor(obj, target){
		this.object = obj
		this.target = target
	}

	collide_bottom(){
		if(this.object.rect.center > this.target.left && this.object.rect.center < this.target.right){
			if(this.object.rect.bottom > this.target.rect.top){
				console.log(true)
				return true
			}else{
				console.log(false)
			}
		}
	}

	collide_right(){
		return this.object.right > this.target.left
	}

	collide_left(){
		return this.object.left < this.target.right
	}

	collide_top(){
		return this.object.top < this.target.bottom
	}

}

function intersects(a, b) {
	return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function overlapsOnX(a, b, skinWidth = 0) {
	return a.left + skinWidth < b.right && a.right - skinWidth > b.left
}

function overlapsOnY(a, b, skinWidth = 0) {
	return a.top + skinWidth < b.bottom && a.bottom - skinWidth > b.top
}
