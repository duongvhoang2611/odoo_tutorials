import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useClicker } from "../clicker_hook";

export class ClickerSystray extends Component {
  static template = "awesome_clicker.clicker_systray";
  static props = {};

  setup() {
    this.action = useService("action");
    this.clicker = useClicker();
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
