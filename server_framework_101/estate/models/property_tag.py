from odoo import models, fields


class PropertyTag(models.Model):
    _name = 'estate.property.tag'
    _description = 'The Real Estate Property Tag'
    _order = 'name'

    name = fields.Char('Name', required=True)
    sequence = fields.Integer('Sequence', default=0)
    color = fields.Integer('Color')

    _sql_constraints = [
        ('unique_name', 'unique(name)', 'The tag name already exists!'),
    ]
