export class AudioSystem {
	update(world) {
		const camera = world.resources.camera
		const gameState = world.resources.game
		const ui = world.resources.ui
		const tracks = world.resources.music
		const sound = world.resources.sound

		const marioEntity = world.resources.playerEntity
		const state = world.getComponent(marioEntity, 'State')
		if (camera.x >= camera.maxX) {
			state.won = true
			state.value = 'win'
			gameState.loop = false
			if (!world.resources.audio.switchedToWinTheme) {
				world.resources.audio.switchedToWinTheme = true
				sound.src = tracks[1]
				sound.loop = false
				sound.play()
			}
			const overlay = document.querySelector('#ui-overlay')
			overlay.classList.remove('hidden')
			overlay.querySelector('h1').textContent = 'LEVEL COMPLETE!'
			ui.playButton.textContent = 'REPLAY'
		}
	}
}
