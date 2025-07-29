import { Component, useState, useRef, onMounted } from '@odoo/owl'
import { TodoItem } from './todo_item'
import { useAutofocus } from '../utils'

export class TodoList extends Component {
  static template = 'awesome_owl.todo_list'

  static components = { TodoItem }

  setup() {
    this.nextId = 0
    this.todos = useState([])
    useAutofocus('input')
  }

  addTodo(e) {
    if (e.keyCode === 13 && e.target.value !== '') {
      this.todos.push({
        id: ++this.nextId,
        title: e.target.value,
        done: false,
      })

      e.target.value = ''
    }
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) {
      todo.done = !todo.done
    }
  }

  removeTodo(id) {
    const todoIndex = this.todos.findIndex((t) => t.id === id)
    if (todoIndex >= 0) {
      this.todos.splice(todoIndex, 1)
    }
  }
}
