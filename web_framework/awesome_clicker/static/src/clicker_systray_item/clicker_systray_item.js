import { Component } from '@odoo/owl'
import { registry } from '@web/core/registry'
import { useService } from '@web/core/utils/hooks'
import { useClicker } from '../clicker_hook'
import { ClickerValue } from '../clicker_value/clicker_value'
import { Dropdown } from '@web/core/dropdown/dropdown'
import { DropdownItem } from '@web/core/dropdown/dropdown_item'

export class ClickerSystray extends Component {
  static template = 'awesome_clicker.clicker_systray'
  static props = {}

  static components = {
    ClickerValue,
    Dropdown,
    DropdownItem,
  }

  setup() {
    this.action = useService('action')
    this.clicker = useClicker()
  }

  openClientAction() {
    this.action.doAction({
      type: 'ir.actions.client',
      tag: 'awesome_clicker.client_action',
      target: 'new',
      name: 'Clicker Game',
    })
  }

  get totalTrees() {
    const initialValue = 0
    return Object.values(this.clicker.trees).reduce(
      (sum, tree) => sum + tree.purchased,
      initialValue
    )
  }

  get totalFruits() {
    const initValue = 0
    return Object.values(this.clicker.fruits).reduce(
      (sum, value) => sum + value,
      initValue
    )
  }
}

export const systrayItem = {
  Component: ClickerSystray,
}

registry
  .category('systray')
  .add('awesome_clicker.clicker_systray', systrayItem, { sequence: 100 })
