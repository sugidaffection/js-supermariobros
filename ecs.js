class World {
	constructor() {
		this.entities = new Map()
		this.systems = []
		this.nextEntityId = 1
	}

	createEntity(components = {}) {
		const id = this.nextEntityId++
		this.entities.set(id, components)
		return id
	}

	addSystem(system) {
		this.systems.push(system)
	}

	query(required = []) {
		const out = []
		this.entities.forEach((components, id) => {
			if (required.every((key) => components[key])) {
				out.push({ id, components })
			}
		})
		return out
	}

	run(stage, context) {
		this.systems.forEach((system) => {
			if (system.stage === stage) {
				system.run(this, context)
			}
		})
	}
}
