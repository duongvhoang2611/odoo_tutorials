import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class ClickerSystray extends Component {
  static template = "awesome_clicker.clicker_systray";
  static props = {};

  setup() {
    this.state = useState({ counter: 0 });
  }

  increment() {
    this.state.counter++;
  }
}

export const systrayItem = {
  Component: ClickerSystray,
};

registry
  .category("systray")
  .add("awesome_clicker.clicker_systray", systrayItem, { sequence: 100 });
