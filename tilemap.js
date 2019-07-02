class Tilemap {

	constructor(w,h){
		this.w = w
		this.h = h
		const spritesheet = new Spritesheet('assets/tileset.png')
		const map = [
			{
				"name" : "sky",
				"sprite" : [3, 23],
				"ranges" : [
					[0,25,0,14]
				]
			},
			{
				"name" : "ground",
				"sprite" : [0,0],
				"ranges" : [
					[0,50,12,14],
					[52,67,12,14],
					[70,130,12,14],
					[132,200,12,14]
				]
			},
			{
				"name" : "brick",
				"sprite" : [1,0],
				"ranges" : [
					[10,11,8,9],
					[12,13,8,9],
					[14,15,8,9],
					[57,58,8,9],
					[59,60,8,9],
					[60,69,4,5],
					[71,74,4,5],
					[74,75,8,9],
					[78,80,8,9],
					[93,94,8,9],
					[96,99,4,5],
					[103,104,4,5],
					[104,106,8,9],
					[106,107,4,5],
					[147,149,8,9],
					[150,151,8,9]
				]
			},
			{
				"name" : "brick2",
				"sprite" : [24,0],
				"ranges" : [
					[6,7,8,9],
					[11,12,8,9],
					[12,13,5,6],
					[13,14,8,9],
					[58,59,8,9],
					[74,75,4,5],
					[85,86,8,9],
					[87,88,8,9],
					[87,88,4,5],
					[89,90,8,9],
					[104,106,4,5],
					[149,150,8,9]
				]
			},
			{
				"name" : "brick3",
				"sprite" : [0,1],
				"ranges" : [
					[110,114,11,12],
					[111,114,10,11],
					[112,114,9,10],
					[113,114,8,9],
					[116,117,8,9],
					[116,118,9,10],
					[116,119,10,11],
					[116,120,11,12],
					[125,130,11,12],
					[126,130,10,11],
					[127,130,9,10],
					[128,130,8,9],
					[132,133,8,9],
					[132,134,9,10],
					[132,135,10,11],
					[132,136,11,12],
					[159,168,11,12],
					[160,168,10,11],
					[161,168,9,10],
					[162,168,8,9],
					[163,168,7,8],
					[164,168,6,7],
					[165,168,5,6],
					[166,168,4,5]
				]
			},
			{
				"name" : "pipe_topleft",
				"sprite" : [0,8],
				"ranges" : [
					[17, 18, 10, 11],
					[23, 24, 9, 10],
					[30, 31, 8, 9],
					[38, 39, 8, 9],
					[141,142,10,11],
					[157,158,10,11]
				]
			},
			{
				"name" : "pipe_topright",
				"sprite" : [1,8],
				"ranges" : [
					[18, 19, 10, 11],
					[24, 25, 9, 10],
					[31, 32, 8, 9],
					[39, 40, 8, 9],
					[142,143,10,11],
					[158,159,10,11]
				]
			},
			{
				"name" : "pipe_bottomleft",
				"sprite" : [0,9],
				"ranges" : [
					[17, 18, 11, 12],
					[23, 24, 10, 12],
					[30, 31, 9, 12],
					[38, 39, 9, 12],
					[141,142,11,12],
					[157,158,11,12]
				]
			},
			{
				"name" : "pipe_bottomright",
				"sprite" : [1,9],
				"ranges" : [
					[18, 19, 11, 12],
					[24, 25, 10, 12],
					[31, 32, 9, 12],
					[39, 40, 9, 12],
					[142,143,11,12],
					[158,159,11,12]
				]
			}
		]

		this.solidsprites = []
		this.background = []

		map.forEach(tiles => {
			const sprite = spritesheet.get_sprite([...tiles.sprite, ...[16,16]])
			tiles.ranges.forEach(range => {
				for(let x = range[0]; x<range[1]; x++){
					for(let y = range[2]; y<range[3]; y++){
						if(tiles.name == 'sky'){
							this.background.push({
								sprite : sprite,
								rect: new Rect(x*32,y*32,32,32)
							})
						}else{
							this.solidsprites.push({
								sprite : sprite,
								rect: new Rect(x*32,y*32,32,32)
							})
						}
					}
				}
			})
		})
	}

	render(ctx){
		this.background
			.filter(obj => obj.rect.right <= this.w + 32 && obj.rect.bottom <= this.h + 32)
			.forEach(obj => {
				obj.sprite.draw(ctx, obj.rect, false)
			})
		this.solidsprites
			.filter(obj => obj.rect.right <= this.w + 32 && obj.rect.bottom <= this.h + 32)
			.forEach(obj => {
				obj.sprite.draw(ctx, obj.rect, false)
			})
	}

	update(speed){
		this.solidsprites
			.forEach(obj => {
				obj.rect.x -= speed
				obj.rect.update()
			})
	}

}