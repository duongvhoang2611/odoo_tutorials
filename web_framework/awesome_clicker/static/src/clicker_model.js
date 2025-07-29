import { Reactive } from '@web/core/utils/reactive'

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
  }

  increment(inc) {
    this.counter += inc
    if (this.level < 1 && this.counter >= 1000) this.level++
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
