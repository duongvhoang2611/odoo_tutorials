import { Reactive } from '@web/core/utils/reactive'
import { EventBus } from '@odoo/owl'
import { rewards } from './click_rewards'
import { choose } from './utils'
import { CURRENT_VERSION } from './clicker_migration'

export class ClickerModel extends Reactive {
  constructor() {
    super()

    this.version = CURRENT_VERSION
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
    this.trees = {
      pear: {
        cost: 1_000_000,
        level: 4,
        produce: 'pear',
        purchased: 0,
      },
      cherry: {
        cost: 1_000_000,
        level: 4,
        produce: 'cherry',
        purchased: 0,
      },
    }
    this.fruits = {
      pear: 0,
      cherry: 0,
    }
    this.multipliers = 1

    document.addEventListener('click', () => this.increment(1), true)

    setInterval(() => {
      for (const bot in this.bots) {
        this.counter +=
          this.bots[bot].increment * this.bots[bot].purchased * this.multipliers
      }
    }, 10 * 1000)

    setInterval(() => {
      for (const tree in this.trees) {
        this.fruits[this.trees[tree].produce] += this.trees[tree].purchased
      }
    }, 30 * 1000)

    this.bus = new EventBus()
  }

  toJSON() {
    const json = { ...this }
    delete json['bus']
    return json
  }

  static fromJSON(json) {
    const clickerModel = new ClickerModel()
    const clickerInstance = Object.assign(clickerModel, json)
    return clickerInstance
  }

  buyMultiplier() {
    const cost = 50000
    if (this.counter < cost) {
      return false
    }

    this.counter -= cost
    this.multipliers++
  }

  buyTree(name) {
    if (!Object.keys(this.trees).includes(name)) {
      throw new Error(`Invalid tree name ${name}`)
    }
    if (this.counter < this.trees[name].cost) {
      return false
    }
    this.counter -= this.trees[name].cost
    this.trees[name].purchased += 1
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
      { counter: 1_000, unlock: 'clickBot' },
      { counter: 5_000, unlock: 'bigBot' },
      { counter: 100_000, unlock: 'power multiplier' },
      { counter: 1_000_000, unlock: 'pear tree & cherry tree' },
    ]
  }

  getReward() {
    const availableRewards = []
    for (const reward of rewards) {
      if (reward.minLevel <= this.level || !reward.minLevel) {
        if (reward.maxLevel >= this.level || !reward.maxLevel) {
          availableRewards.push(reward)
        }
      }
    }
    const reward = choose(availableRewards)
    this.bus.trigger('REWARD', reward)
    return reward
  }
}
