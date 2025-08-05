import { useService } from '@web/core/utils/hooks'
import { Component, onWillStart, useState } from '@odoo/owl'
import { KeepLast } from '@web/core/utils/concurrency'
import { fuzzyLookup } from '@web/core/utils/search'
import { Pager } from '@web/core/pager/pager'

export class CustomerList extends Component {
  static components = { Pager }
  static template = 'awesome_kanban.CustomerList'
  static props = {
    selectCustomer: {
      type: Function,
    },
  }

  setup() {
    this.orm = useService('orm')
    this.state = useState({
      searchString: '',
      displayActiveCustomers: false,
      partners: [],
      pager: { offset: 0, limit: 20 },
    })
    this.keepLast = new KeepLast()

    onWillStart(async () => {
      const { length, records } = await this.loadCustomers()
      this.state.partners = records
      this.state.pager.total = length
    })
  }

  get displayedPartners() {
    return this.filterCustomers(this.state.searchString)
  }

  async onChangeActiveCustomers(ev) {
    const isChecked = ev.target.checked
    if (this.state.displayActiveCustomers === isChecked) return
    this.state.displayActiveCustomers = isChecked
    this.state.pager.offset = 0
    const { length, records } = await this.keepLast.add(this.loadCustomers())
    this.state.partners = records
    this.state.pager.total = length
  }

  filterCustomers(name) {
    if (name) {
      return fuzzyLookup(
        name,
        this.state.partners,
        (partner) => partner.display_name
      )
    } else {
      return this.state.partners
    }
  }

  loadCustomers() {
    const { limit, offset } = this.state.pager
    const domain = this.state.displayActiveCustomers
      ? [['opportunity_ids', '!=', false]]
      : []
    return this.orm.webSearchRead('res.partner', domain, {
      specification: {
        display_name: {},
      },
      limit,
      offset,
    })
  }

  async onUpdatePager(newState) {
    Object.assign(this.state.pager, newState)
    const { records } = await this.loadCustomers()
    this.state.partners = records
    this.filterCustomers(this.state.searchString)
  }
}
