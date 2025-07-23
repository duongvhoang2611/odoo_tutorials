import { Component, useState } from "@odoo/owl";
import { TodoItem } from "./todo_item";

export class TodoList extends Component {
  static template = "awesome_owl.todo_list";

  static components = { TodoItem };

  setup() {
    this.todos = useState([
      { id: 1, title: "buy bread", done: true },
      { id: 2, title: "buy eggs", done: true },
      { id: 3, title: "buy milk", done: false },
    ]);
  }
}
