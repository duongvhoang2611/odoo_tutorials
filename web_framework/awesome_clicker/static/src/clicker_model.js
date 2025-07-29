import { Reactive } from '@web/core/utils/reactive'
import { EventBus } from '@odoo/owl'

export class ClickerModel extends Reactive {
  constructor() {
    super()

    this.counter = 0
    this.level = 0
    this.bots = {
      clickBot: {
        cost: 1000,
        level: 1,
        increment: 10,
        purchased: 0,
      },
      bigBot: {
        cost: 5000,
        level: 2,
        increment: 100,
        purchased: 0,
      },
    }
    this.multipliers = 1

    document.addEventListener('click', () => this.increment(1), true)

    setInterval(() => {
      for (const bot in this.bots) {
        this.counter +=
          this.bots[bot].increment * this.bots[bot].purchased * this.multipliers
      }
    }, 10 * 1000)

    this.bus = new EventBus()
  }

  buyMultiplier() {
    const cost = 50000
    if (this.counter < cost) {
      return false
    }

    this.counter -= cost
    this.multipliers++
  }

  increment(inc) {
    this.counter += inc

    if (
      this.milestone[this.level] &&
      this.counter >= this.milestone[this.level].counter
    ) {
      this.bus.trigger('MILESTONE', this.milestone[this.level])
      this.level += 1
    }
  }

  buyBot(name) {
    if (!Object.keys(this.bots).includes(name)) {
      throw new Error(`Unknown bot ${name}`)
    }

    const costBot = this.bots[name].cost

    if (this.counter < costBot) {
      return false
    }

    this.counter -= costBot
    this.bots[name].purchased += 1
  }

  get milestone() {
    return [
      { counter: 1000, unlock: 'clickBot' },
      { counter: 5000, unlock: 'bigBot' },
      { counter: 100000, unlock: 'power multiplier' },
    ]
  }
}
