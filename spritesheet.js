class Sprite {

	constructor(image,[x,y,w,h]){
		this.image = image
		this.x = x * w
		this.y = y * h
		this.w = w
		this.h = h
	}

	draw(ctx,{x,y,w,h},flip){
		if(flip){
			ctx.save()
			ctx.scale(-1, 1)
			ctx.drawImage(this.image,this.x,this.y,this.w,this.h,-x,y,-w,h)
			ctx.restore()
		}else{
			ctx.drawImage(this.image,this.x,this.y,this.w,this.h,x,y,w,h)
		}
	}
}

class Spritesheet {

	constructor(path){
		this.image = new Image()
		this.image.src = path
		this.path = path
		this.sprites = {}
	}

	get_sprites(sprites){
		Object.keys(sprites).forEach(k => {
			if (!this.sprites.hasOwnProperty(k)){
				this.sprites[k] = []
			}
			sprites[k].forEach(sprite => {
				this.sprites[k].push(new Sprite(this.image,sprite))
			})
		});

		return this.sprites
	}

	get_sprite(sprite){
		return new Sprite(this.image, sprite)
	}

	isLoaded() {
		return this.image.complete && this.image.naturalHeight !== 0
	}

	waitForLoad() {
		if (this.isLoaded()) return Promise.resolve()
		return new Promise((resolve, reject) => {
			this.image.onload = resolve
			this.image.onerror = reject
		})
	}
}

class SpriteAnimation {

	constructor(sprites){
		this.idx = 0
		this.speed = .1
		this.sprites = sprites
	}

	play(ctx, name, rect, flip){
		if (!this.sprites[name] || this.sprites[name].length === 0) {
			name = 'idle'
			if (!this.sprites[name] || this.sprites[name].length === 0) {
				const firstKey = Object.keys(this.sprites)[0]
				if (firstKey) name = firstKey
				else return
			}
		}

		this.idx += this.speed

		if(Math.floor(this.idx) > this.sprites[name].length - 1){
			this.idx = 0
		}

		this.sprites[name][Math.floor(this.idx)].draw(ctx, rect, flip)
	}

}
