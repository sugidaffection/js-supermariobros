class Tilemap {

	constructor(w, h) {
		this.w = w
		this.h = h
		this.tileSize = 32
		this.sectorSize = 8
		this.cameraX = 0

		const spritesheet = new Spritesheet('assets/tileset.png')
		this.spritesheet = spritesheet
		this.spriteCache = new Map()

		this.background = []
		this.solidsprites = []
		this.sectors = new Map()
		this.objectives = []

		this.chunkTemplates = []
		this.repeatableTemplates = []
		this.nextChunkStartColumn = 0
		this.activeChunkCount = 0
	}

	static async fromJSON(w, h, level = '1_1', path = 'assets/map.json') {
		const tilemap = new Tilemap(w, h)
		const response = await fetch(path)
		const mapData = await response.json()
		tilemap.loadLevel(mapData, level)
		return tilemap
	}

	getSprite(spriteDef) {
		const key = spriteDef.join(',')
		if (!this.spriteCache.has(key)) {
			this.spriteCache.set(key, this.spritesheet.get_sprite([...spriteDef, ...[16, 16]]))
		}
		return this.spriteCache.get(key)
	}

	loadLevel(mapData, level) {
		const levelData = mapData[level]
		if (!levelData) {
			throw new Error(`Unknown level: ${level}`)
		}

		const chunkDefs = levelData.chunks || [
			{
				id: `${level}_legacy`,
				startColumn: 0,
				repeat: false,
				tiles: levelData.backgrounds || []
			}
		]

		this.chunkTemplates = chunkDefs
		this.repeatableTemplates = chunkDefs.filter(chunk => chunk.repeat)
		this.objectives = (levelData.objectives || []).map(objective => ({ ...objective, reached: false }))

		chunkDefs
			.filter(chunk => !chunk.repeat)
			.sort((a, b) => (a.startColumn || 0) - (b.startColumn || 0))
			.forEach(chunk => this.instantiateChunk(chunk, chunk.startColumn || 0))

		this.activeChunkCount = chunkDefs.filter(chunk => !chunk.repeat).length
		this.nextChunkStartColumn = this.getRightmostLoadedColumn()
	}

	instantiateChunk(chunkTemplate, startColumn) {
		const tileGroups = chunkTemplate.tiles || chunkTemplate.backgrounds || []

		tileGroups.forEach(tiles => {
			const sprite = this.getSprite(tiles.sprite)
			const isSky = tiles.name === 'sky'
			tiles.ranges.forEach(range => {
				for (let x = range[0]; x < range[1]; x++) {
					for (let y = range[2]; y < range[3]; y++) {
						const column = x + startColumn
						const tile = {
							sprite,
							name: tiles.name,
							worldRect: new Rect(column * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize),
							column
						}

						if (isSky) {
							this.background.push(tile)
						} else {
							this.solidsprites.push(tile)
						}

						this.addToSector(tile, isSky ? 'background' : 'solid')
					}
				}
			})
		})
	}

	render(ctx, cameraX=0){
		this.background
			.filter(obj => obj.rect.right - cameraX >= -32 && obj.rect.left - cameraX <= this.w + 32 && obj.rect.bottom <= this.h + 32)
			.forEach(obj => {
				obj.sprite.draw(ctx, new Rect(obj.rect.x - cameraX, obj.rect.y, obj.rect.w, obj.rect.h), false)
			})
		this.solidsprites
			.filter(obj => obj.rect.right - cameraX >= -32 && obj.rect.left - cameraX <= this.w + 32 && obj.rect.bottom <= this.h + 32)
			.forEach(obj => {
				obj.sprite.draw(ctx, new Rect(obj.rect.x - cameraX, obj.rect.y, obj.rect.w, obj.rect.h), false)
			})
	}

	buildCollisionGrid(grid) {
		this.solidsprites.forEach(obj => grid.insert(obj.rect))
	}

	update(speed){
		this.solidsprites
			.forEach(obj => {
				obj.rect.x -= speed
				obj.rect.update()
			})
		})
		return max
	}

	queryVisibleTiles(type) {
		const leftSector = Math.floor(this.cameraX / (this.sectorSize * this.tileSize))
		const rightSector = Math.floor((this.cameraX + this.w) / (this.sectorSize * this.tileSize))
		const tiles = []

		for (let sector = leftSector - 1; sector <= rightSector + 1; sector++) {
			if (this.sectors.has(sector)) {
				tiles.push(...this.sectors.get(sector)[type])
			}
		}

		return tiles
	}

	querySolidsByWorldRect(worldRect) {
		const leftSector = Math.floor(worldRect.left / (this.sectorSize * this.tileSize))
		const rightSector = Math.floor(worldRect.right / (this.sectorSize * this.tileSize))
		const solids = []

		for (let sector = leftSector - 1; sector <= rightSector + 1; sector++) {
			if (this.sectors.has(sector)) {
				solids.push(...this.sectors.get(sector).solid)
			}
		}

		return solids
	}

	render(ctx) {
		this.ensureChunksForCamera()
		const backgroundTiles = this.queryVisibleTiles('background')
		const solidTiles = this.queryVisibleTiles('solid')

		backgroundTiles.forEach(tile => {
			const screenX = tile.worldRect.x - this.cameraX
			if (screenX + this.tileSize >= 0 && screenX <= this.w) {
				tile.sprite.draw(ctx, { x: screenX, y: tile.worldRect.y, w: this.tileSize, h: this.tileSize }, false)
			}
		})

		solidTiles.forEach(tile => {
			const screenX = tile.worldRect.x - this.cameraX
			if (screenX + this.tileSize >= 0 && screenX <= this.w) {
				tile.sprite.draw(ctx, { x: screenX, y: tile.worldRect.y, w: this.tileSize, h: this.tileSize }, false)
			}
		})
	}

	setCameraX(nextCameraX) {
		this.cameraX = Math.max(0, nextCameraX)
	}

	getFirstObjective(type) {
		return this.objectives.find(objective => objective.type === type)
	}

	isObjectiveReached(type, worldX) {
		const objective = this.getFirstObjective(type)
		if (!objective) {
			return false
		}
		if (worldX >= objective.worldX) {
			objective.reached = true
		}
		return objective.reached
	}

}
