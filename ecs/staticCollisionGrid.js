class StaticCollisionGrid {
	constructor(tileSize = 32) {
		this.tileSize = tileSize
		this.cells = new Map()
		this.tiles = []
	}

	cellKey(x, y) {
		return `${x},${y}`
	}

	insert(tileRect) {
		const cellX = Math.floor(tileRect.x / this.tileSize)
		const cellY = Math.floor(tileRect.y / this.tileSize)
		const key = this.cellKey(cellX, cellY)
		if (!this.cells.has(key)) this.cells.set(key, [])
		const entry = { rect: tileRect }
		this.cells.get(key).push(entry)
		this.tiles.push(entry)
	}

	query(transform) {
		const startX = Math.floor(transform.x / this.tileSize)
		const endX = Math.floor((transform.x + transform.w) / this.tileSize)
		const startY = Math.floor(transform.y / this.tileSize)
		const endY = Math.floor((transform.y + transform.h) / this.tileSize)
		const result = []
		for (let x = startX - 1; x <= endX + 1; x++) {
			for (let y = startY - 1; y <= endY + 1; y++) {
				const key = this.cellKey(x, y)
				if (this.cells.has(key)) {
					result.push(...this.cells.get(key))
				}
			}
		}
		return result
	}
}
