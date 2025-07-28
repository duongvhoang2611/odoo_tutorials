import { Component, useState, useExternalListener } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class ClickerSystray extends Component {
  static template = "awesome_clicker.clicker_systray";
  static props = {};

  setup() {
    this.state = useState({ counter: 0 });
    this.action = useService("action");
    useExternalListener(
      document.body,
      "click",
      () => this.state.counter++,
      true
    );
  }

  increment() {
    this.state.counter += 9;
  }

  openClientAction() {
    this.action.doAction({
      type: "ir.actions.client",
      tag: "awesome_clicker.client_action",
      target: "new",
      name: "Clicker Game",
    });
  }
}

export const systrayItem = {
  Component: ClickerSystray,
};

registry
  .category("systray")
  .add("awesome_clicker.clicker_systray", systrayItem, { sequence: 100 });
