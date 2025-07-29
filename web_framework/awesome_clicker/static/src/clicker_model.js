import { Reactive } from '@web/core/utils/reactive'
import { EventBus } from '@odoo/owl'

export class ClickerModel extends Reactive {
  constructor() {
    super()

    this.counter = 0
    this.level = 0
    this.clickBots = 0

    document.addEventListener('click', () => this.increment(1), true)

    setInterval(() => {
      this.counter += this.clickBots * 10
    }, 10 * 1000)

    this.bus = new EventBus()
  }

  increment(inc) {
    this.counter += inc
    if (this.level < 1 && this.counter >= 1000) {
      this.bus.trigger('MILESTONE_1k')
      this.level++
    }
  }

  buyClickBot() {
    const clickBotCost = 1000
    if (this.counter < clickBotCost) {
      return false
    }

    this.counter -= clickBotCost
    this.clickBots += 1
  }
}
