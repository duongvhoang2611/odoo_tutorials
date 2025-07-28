import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

const clickerService = {
  start(env) {
    const state = reactive({ counter: 0 });

    function increment(inc) {
      state.counter += inc;
    }

    document.addEventListener("click", () => increment(1), true);

    return {
      state,
      increment,
    };
  },
};

registry.category("services").add("awesome_clicker.clicker", clickerService);
