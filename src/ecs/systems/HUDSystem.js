export class HUDSystem {
    update(world) {
        const ctx = world.resources.ctx
        const stats = world.resources.stats
        const viewport = world.resources.viewport

        // Update time
        if (world.resources.game.running) {
            stats.time -= world.resources.time.dt
            if (stats.time < 0) stats.time = 0
        }

        ctx.save()
        ctx.fillStyle = 'white'
        ctx.font = '20px "Press Start 2P", cursive, Arial'
        ctx.textBaseline = 'top'

        const margin = 20
        const row1Y = 10
        const row2Y = 35

        // Score
        ctx.fillText('MARIO', margin, row1Y)
        ctx.fillText(stats.score.toString().padStart(6, '0'), margin, row2Y)

        // Coins
        ctx.fillText('COINS', viewport.w * 0.35, row1Y)
        ctx.fillText('x' + stats.coins.toString().padStart(2, '0'), viewport.w * 0.35, row2Y)

        // World
        ctx.fillText('WORLD', viewport.w * 0.65, row1Y)
        ctx.fillText(stats.world, viewport.w * 0.65, row2Y)

        // Time
        ctx.fillText('TIME', viewport.w * 0.85, row1Y)
        ctx.fillText(Math.ceil(stats.time).toString().padStart(3, '0'), viewport.w * 0.85, row2Y)

        ctx.restore()
    }
}
