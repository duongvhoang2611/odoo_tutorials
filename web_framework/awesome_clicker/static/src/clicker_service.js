import { registry } from '@web/core/registry'
import { reactive } from '@odoo/owl'

const clickerService = {
  start(env) {
    const state = reactive({
      counter: 0,
      level: 0,
      clickBots: 0,
    })

    setInterval(() => {
      state.counter += state.clickBots * 10
    }, 10 * 1000)

    function increment(inc) {
      state.counter += inc
      if (state.level < 1 && state.counter >= 1000) state.level++
    }

    function buyClickBot() {
      const clickBotCost = 1000
      if (state.counter < clickBotCost) {
        return false
      }

      state.counter -= clickBotCost
      state.clickBots += 1
    }

    document.addEventListener('click', () => increment(1), true)

    return {
      state,
      increment,
      buyClickBot,
    }
  },
}

registry.category('services').add('awesome_clicker.clicker', clickerService)
