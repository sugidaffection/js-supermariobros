import { Rect } from './lib.js'
import { Spritesheet } from './spritesheet.js'

// Use BASE_URL for GitHub Pages compatibility
const BASE_URL = import.meta.env.BASE_URL || '/'

export class Tilemap {
	constructor(w, h, levelData) {
		this.w = w
		this.h = h
		this.tileSize = 32
		this.chunkTiles = 16
		this.chunkPx = this.chunkTiles * this.tileSize
		this.tilesheet = new Spritesheet(`${BASE_URL}assets/sprites/tileset.png`)
		this.background = []
		this.solids = []
		this.chunks = new Map()
		this.levelWidthPx = 0
		this._load(levelData)
	}

	_load(levelData) {
		const chunks = levelData.chunks || []
		
		chunks.forEach((chunk) => {
			const startColumn = chunk.startColumn || 0
			const chunkWidth = chunk.width || 0
			
			;(chunk.tiles || []).forEach((tiles) => {
				const sprite = this.tilesheet.get_sprite([...tiles.sprite, 16, 16])
				const isSolid = !['sky', 'brick2', 'brick3'].includes(tiles.name)
				const isSky = tiles.name === 'sky'
				
				tiles.ranges.forEach((range) => {
					// Expand sky tiles to cover the whole chunk width if specified
					const startX = isSky ? 0 : range[0]
					const endX = isSky ? Math.max(range[1], chunkWidth) : range[1]
					
					for (let x = startX; x < endX; x++) {
						for (let y = range[2]; y < range[3]; y++) {
							const absX = (startColumn + x) * this.tileSize
							const absY = y * this.tileSize
							const tile = {
								sprite,
								rect: new Rect(absX, absY, this.tileSize, this.tileSize),
								solid: isSolid
							}
							this.levelWidthPx = Math.max(this.levelWidthPx, tile.rect.right)
							if (tile.solid) {
								this.solids.push(tile)
								const chunkIdx = Math.floor(tile.rect.left / this.chunkPx)
								if (!this.chunks.has(chunkIdx)) {
									this.chunks.set(chunkIdx, [])
								}
								this.chunks.get(chunkIdx).push(tile)
							} else {
								this.background.push(tile)
							}
						}
					}
				})
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
		const minY = -this.tileSize
		const maxY = this.h + this.tileSize
		const drawTile = (obj) => {
			if (obj.rect.right >= minX && obj.rect.left <= maxX && obj.rect.bottom >= minY && obj.rect.top <= maxY) {
				obj.sprite.draw(ctx, { x: obj.rect.x - cameraX, y: obj.rect.y, w: obj.rect.w, h: obj.rect.h }, false)
			}
		}
		this.background.forEach(drawTile)
		this.solids.forEach(drawTile)
	}
}
