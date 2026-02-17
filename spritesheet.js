class Sprite {

	constructor(image,[x,y,w,h]){
		this.image = image
		this.x = x * w
		this.y = y * h
		this.w = w
		this.h = h
	}

	draw(ctx,{x,y,w,h},flip){

		// this.image.decode().then(() => {
		// 	w = this.image.width * w / this.image.width
		// 	h = this.image.height * h / this.image.height

			
		// })

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
}

class SpriteAnimation {

	constructor(sprites){
		this.idx = 0
		this.speed = .1
		this.sprites = sprites
		this.currentName = 'idle'
		console.log('SpriteAnimation created with sprites:', Object.keys(sprites))
	}

	play(ctx, name, rect, flip){
		if (!this.sprites[name] || this.sprites[name].length === 0) {
			console.warn('SpriteAnimation: sprites[' + name + '] is undefined. Available:', Object.keys(this.sprites))
			name = 'idle'
			if (!this.sprites[name] || this.sprites[name].length === 0) {
				const firstKey = Object.keys(this.sprites)[0]
				if (firstKey) {
					console.warn('SpriteAnimation: falling back to first key:', firstKey)
					name = firstKey
				}
				else {
					console.error('SpriteAnimation: no sprites available')
					return
				}
			}
		}

		this.idx += this.speed

		if(Math.floor(this.idx) > this.sprites[name].length - 1){
			this.idx = 0
		}

		this.sprites[name][Math.floor(this.idx)].draw(ctx, rect, flip)
	}

}