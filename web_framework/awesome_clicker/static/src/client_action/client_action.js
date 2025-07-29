import { Component } from '@odoo/owl'
import { registry } from '@web/core/registry'
import { useClicker } from '../clicker_hook'

export class ClickerClientAction extends Component {
  static template = 'awesome_clicker.client_action'
  static props = ['*']

  setup() {
    this.clicker = useClicker()
  }
}

registry
  .category('actions')
  .add('awesome_clicker.client_action', ClickerClientAction)
