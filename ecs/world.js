class World {
	constructor() {
		this.nextEntityId = 1
		this.entities = new Set()
		this.componentStores = new Map()
		this.systems = []
		this.resources = {
			time: { dt: 1 / 60 },
			camera: { x: 0, maxX: 1200, viewportWidth: 600 },
			game: { loop: false },
			audio: { switchedToWinTheme: false },
			ui: {},
		}
	}

	createEntity() {
		const id = this.nextEntityId++
		this.entities.add(id)
		return id
	}

	destroyEntity(entity) {
		this.entities.delete(entity)
		this.componentStores.forEach(store => store.delete(entity))
	}

	registerComponent(name) {
		if (!this.componentStores.has(name)) {
			this.componentStores.set(name, new Map())
		}
		return this.componentStores.get(name)
	}

	addComponent(entity, name, value) {
		if (!this.entities.has(entity)) return null
		const store = this.registerComponent(name)
		store.set(entity, value)
		return value
	}

	getComponent(entity, name) {
		const store = this.componentStores.get(name)
		return store ? store.get(entity) : undefined
	}

	getStore(name) {
		return this.componentStores.get(name) || this.registerComponent(name)
	}

	query(componentNames) {
		const names = [...componentNames]
		if (!names.length) return []
		const firstStore = this.componentStores.get(names[0])
		if (!firstStore) return []

		const entities = []
		for (const entity of firstStore.keys()) {
			if (names.every(name => this.getStore(name).has(entity))) {
				entities.push(entity)
			}
		}
		return entities
	}

	addSystem(system, priority = 0) {
		this.systems.push({ system, priority })
		this.systems.sort((a, b) => a.priority - b.priority)
	}

	update(dt) {
		this.resources.time.dt = dt
		for (const { system } of this.systems) {
			if (typeof system.update === 'function') {
				system.update(this, dt)
			}
		}
	}
}
