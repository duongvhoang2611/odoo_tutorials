from odoo import models, fields, api


class PropertyType(models.Model):
    _name = 'estate.property.type'
    _description = 'Real Estate Property Type'
    _order = 'name'

    name = fields.Char('Name', required=True)
    property_ids = fields.One2many(
        'estate.property', 'property_type_id', string='Properties'
    )
    sequence = fields.Integer(
        'Sequence', default=1, help='Used to order stages. Lower is better.'
    )
    offer_ids = fields.One2many(
        'estate.property.offer', 'property_type_id', string='Offers'
    )

    offer_count = fields.Integer('Offer Count', compute='_compute_offer_count')

    @api.depends('offer_ids')
    def _compute_offer_count(self):
        for record in self:
            record.offer_count = len(record.offer_ids)

    _sql_constraints = [
        ('unique_name', 'unique(name)', 'The property type name already exists!'),
    ]
