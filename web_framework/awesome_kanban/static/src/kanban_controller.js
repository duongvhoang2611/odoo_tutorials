import { KanbanController } from '@web/views/kanban/kanban_controller'
import { CustomerList } from './customer_list/customer_list'

export class AwesomeKanbanController extends KanbanController {
  static components = {
    ...KanbanController.components,
    CustomerList,
  }

  static template = 'web_framework.AwesomeKanbanController'

  setup() {
    super.setup()
    this.searchKey = Symbol('isFromAwesomeKanban')
  }

  selectCustomer(id, name) {
    const customerFilters = this.env.searchModel.getSearchItems(
      (searchItem) => searchItem[this.searchKey]
    )

    for (const customerFilter of customerFilters) {
      if (customerFilter.isActive) {
        this.env.searchModel.toggleSearchItem(customerFilter.id)
      }
    }

    this.env.searchModel.createNewFilters([
      {
        description: name,
        domain: [['partner_id', '=', id]],
        [this.searchKey]: true,
      },
    ])
  }
}
