import { Component, useState } from "@odoo/owl";
import { TodoItem } from "./todo_item";

export class TodoList extends Component {
  static template = "awesome_owl.todo_list";

  static components = { TodoItem };

  setup() {
    this.nextId = 0;
    this.todos = useState([]);
  }

  addTodo(e) {
    if (e.keyCode === 13 && e.target.value !== "") {
      this.todos.push({
        id: ++this.nextId,
        title: e.target.value,
        done: false,
      });

      e.target.value = "";
    }
  }
}
