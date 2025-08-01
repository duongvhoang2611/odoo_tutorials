/** @odoo-module **/

import { Component, markup, useState } from '@odoo/owl'
import { Counter } from './counter/counter'
import { Card } from './card/card'
import { TodoList } from './todo_list/todo_list'

export class Playground extends Component {
  static template = 'awesome_owl.playground'

  setup() {
    this.string1 = "<div class='text-primary'>some content</div>"
    this.string2 = markup("<div class='text-primary'>some content</div>")
    this.sum = useState({ value: 2 })
  }

  static components = { Counter, Card, TodoList }

  incrementSum() {
    this.sum.value++
  }
}
