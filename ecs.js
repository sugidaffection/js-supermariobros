export class World {
	constructor() {
		this.entities = new Map()
		this.systems = []
		this.nextEntityId = 1
		this.resources = {}
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

	getComponent(entityId, componentName) {
		const entity = this.entities.get(entityId)
		if (!entity) return null
		return entity[componentName] || null
	}

	setComponent(entityId, componentName, component) {
		const entity = this.entities.get(entityId)
		if (!entity) return false
		entity[componentName] = component
		return true
	}

	removeComponent(entityId, componentName) {
		const entity = this.entities.get(entityId)
		if (!entity) return false
		delete entity[componentName]
		return true
	}

	hasComponent(entityId, componentName) {
		const entity = this.entities.get(entityId)
		return entity ? componentName in entity : false
	}
}
