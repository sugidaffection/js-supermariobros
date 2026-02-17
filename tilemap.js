class Tilemap {
	constructor(w, h, levelData) {
		this.w = w
		this.h = h
		this.tileSize = 32
		this.chunkTiles = 16
		this.chunkPx = this.chunkTiles * this.tileSize
		this.tilesheet = new Spritesheet('assets/tileset.png')
		this.background = []
		this.solids = []
		this.chunks = new Map()
		this.levelWidthPx = 0
		this._load(levelData)
	}

	_load(levelData) {
		const tileLayers = levelData.backgrounds || (levelData.chunks || []).flatMap((chunk) =>
			(chunk.tiles || []).map((tileDef) => ({ ...tileDef }))
		)

		tileLayers.forEach((tiles) => {
			const sprite = this.tilesheet.get_sprite([...tiles.sprite, 16, 16])
			tiles.ranges.forEach((range) => {
				for (let x = range[0]; x < range[1]; x++) {
					for (let y = range[2]; y < range[3]; y++) {
						const tile = {
							sprite,
							rect: new Rect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize),
							solid: tiles.name !== 'sky'
						}
						this.levelWidthPx = Math.max(this.levelWidthPx, tile.rect.right)
						if (tile.solid) {
							this.solids.push(tile)
							const chunkX = Math.floor(tile.rect.left / this.chunkPx)
							if (!this.chunks.has(chunkX)) {
								this.chunks.set(chunkX, [])
							}
							this.chunks.get(chunkX).push(tile)
						} else {
							this.background.push(tile)
						}
					}
				}
			})
		})
	}

	populateCollisionGrid(grid) {
		this.solids.forEach(tile => {
			grid.insert(tile.rect)
		})
	}

	querySolids(rect) {
		const minChunk = Math.floor(rect.left / this.chunkPx) - 1
		const maxChunk = Math.floor(rect.right / this.chunkPx) + 1
		const nearby = []
		for (let chunk = minChunk; chunk <= maxChunk; chunk++) {
			if (this.chunks.has(chunk)) {
				nearby.push(...this.chunks.get(chunk))
			}
		}
		return nearby
	}

	render(ctx, cameraX) {
		const minX = cameraX - this.tileSize
		const maxX = cameraX + this.w + this.tileSize
		const drawTile = (obj) => {
			if (obj.rect.right >= minX && obj.rect.left <= maxX && obj.rect.bottom <= this.h + this.tileSize) {
				obj.sprite.draw(ctx, { x: obj.rect.x - cameraX, y: obj.rect.y, w: obj.rect.w, h: obj.rect.h }, false)
			}
		}
		this.background.forEach(drawTile)
		this.solids.forEach(drawTile)
	}
}
