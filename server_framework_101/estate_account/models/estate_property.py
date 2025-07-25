from odoo import models, Command


class InheritedModel(models.Model):
    _inherit = 'estate.property'

    def action_sold(self):
        for property in self:
            self.env['account.move'].create(
                {
                    'partner_id': property.buyer_id.id,
                    'move_type': 'out_invoice',
                    'invoice_line_ids': [
                        Command.create(
                            {
                                'name': '6% commission',
                                'quantity': 1,
                                'price_unit': property.selling_price * 0.06,
                            }
                        ),
                        Command.create(
                            {
                                'name': 'administrative fees',
                                'quantity': 1,
                                'price_unit': 100.00,
                            }
                        ),
                    ],
                }
            )

        return super().action_sold()
