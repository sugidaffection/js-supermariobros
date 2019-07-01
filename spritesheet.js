class Sprite {

	constructor(image,[x,y,w,h]){
		this.image = image
		this.x = x
		this.y = y
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

		this.sprites = {}
		this.rect = new Rect(0,0,this.image.width,this.image.height)
	}

	add_sprites(sprites){
		Object.keys(sprites).forEach(k => {
			if (!this.sprites.hasOwnProperty(k)){
				this.sprites[k] = []
			}
			sprites[k].forEach(sprite => {
				this.sprites[k].push(new Sprite(this.image,sprite))
			})
		});

		return this
	}

	scale(w,h){
		this.rect.w = this.image.width * w / this.image.width
		this.rect.h = this.image.height * h / this.image.height
		return this
	}

	pos(x,y){
		this.rect.x = x
		this.rect.y = y
		return this
	}

	draw(ctx,name,idx,flip){
		this.sprites[name][idx].draw(ctx,this.rect,flip)

		return this
	}

	update(){
		this.rect.update()

		return this
	}

	length(animation){
		return this.sprites[animation].length
	}

}