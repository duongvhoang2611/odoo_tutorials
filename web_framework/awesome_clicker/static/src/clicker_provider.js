import { registry } from '@web/core/registry'

const commandProviderREgistry = registry.category('command_provider')

commandProviderREgistry.add('clicker', {
  provide: (env, options) => [
    {
      name: 'Buy 1 click bot',
      action: () => {
        env.services['awesome_clicker.clicker'].buyBot('clickBot')
      },
    },
    {
      name: 'Open Clicker Game',
      action: () => {
        env.services.action.doAction({
          type: 'ir.actions.client',
          tag: 'awesome_clicker.client_action',
          target: 'new',
          name: 'Clicker Game',
        })
      },
    },
  ],
})
