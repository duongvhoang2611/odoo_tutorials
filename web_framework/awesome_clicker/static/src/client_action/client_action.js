import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class ClickerClientAction extends Component {
  static template = "awesome_clicker.client_action";
  static props = ["*"];

  setup() {
    this.clickService = useState(useService("awesome_clicker.clicker"));
  }
}

registry
  .category("actions")
  .add("awesome_clicker.client_action", ClickerClientAction);
