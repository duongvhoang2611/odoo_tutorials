from odoo import models, fields, api, exceptions
from dateutil.relativedelta import relativedelta


class Property(models.Model):
    _name = 'estate.property'
    _description = 'The Real Estate Property'
    _order = 'id desc'

    name = fields.Char('Title', required=True, translate=True)
    property_type_id = fields.Many2one('estate.property.type', string='Property Type')
    property_tag_ids = fields.Many2many('estate.property.tag', string='Tags')
    offer_ids = fields.One2many('estate.property.offer', 'property_id', string='Offer')
    salesperson_id = fields.Many2one(
        'res.users', string='Salesperson', default=lambda self: self.env.user
    )
    buyer_id = fields.Many2one('res.partner', string='Buyer', copy=False)
    description = fields.Text('Description')
    postcode = fields.Char('Postcode')
    date_availability = fields.Date(
        'Available From',
        copy=False,
        default=lambda self: fields.Date.today() + relativedelta(months=3),
    )
    expected_price = fields.Float('Expected Price', required=True)
    selling_price = fields.Float('Selling Price', readonly=True, copy=False)
    bedrooms = fields.Integer('Bedrooms', default=2)
    living_area = fields.Integer('Living Area (sqm)')
    facades = fields.Integer('Facades')
    garage = fields.Boolean('Garage')
    garden = fields.Boolean('Garden')
    garden_area = fields.Integer('Garden Area (sqm)', default=0)
    garden_orientation = fields.Selection(
        [('north', 'North'), ('south', 'South'), ('east', 'East'), ('west', 'West')],
        string='Garden Orientation',
        help='Type is used to separate Leads and Opportunities',
    )
    active = fields.Boolean('Active', default=True)
    state = fields.Selection(
        selection=[
            ('new', 'New'),
            ('offer_received', 'Offer Received'),
            ('offer_accepted', 'Offer Accepted'),
            ('sold', 'Sold'),
            ('cancelled', 'Cancelled'),
        ],
        string='Status',
        required=True,
        copy=False,
        default='new',
    )
    total_area = fields.Integer(
        'Total Area (Sqm)', compute='_compute_total_area', store=True
    )
    best_price = fields.Float('Best Offer', compute='_compute_best_price', store=True)

    _sql_constraints = [
        (
            'positive_expected_price',
            'CHECK(expected_price > 0)',
            'Expected price must be strictly positive.',
        ),
        (
            'positive_selling_price',
            'CHECK(selling_price > 0)',
            'Selling price must be strictly positive.',
        ),
    ]

    @api.depends('living_area', 'garden_area')
    def _compute_total_area(self):
        for record in self:
            record.total_area = record.living_area + record.garden_area

    @api.depends('offer_ids.price')
    def _compute_best_price(self):
        for record in self:
            prices = record.offer_ids.mapped('price')
            record.best_price = max(prices) if prices else 0.0

    @api.onchange('garden')
    def _onchange_garden(self):
        if self.garden:
            self.garden_area = 10
            self.garden_orientation = 'north'
        else:
            self.garden_area = 0
            self.garden_orientation = None

    def action_cancel(self):
        if self.state == 'sold':
            raise exceptions.UserError('A sold property cannot be cancelled.')
        self.state = 'cancelled'

    def action_sold(self):
        if self.state == 'cancelled':
            raise exceptions.UserError('A cancelled property cannot be sold.')
        self.state = 'sold'

    @api.constrains('selling_price', 'expected_price')
    def _check_selling_price(self):
        for property_record in self:
            if (
                property_record.selling_price
                and property_record.expected_price
                and property_record.selling_price < property_record.expected_price * 0.9
            ):
                raise exceptions.ValidationError(
                    'Selling price cannot be lower than 90% of the expected price.'
                )

    @api.ondelete(at_uninstall=False)
    def _unlink_if_not_new_or_cancelled(self):
        for record in self:
            if record.state not in ['new', 'cancelled']:
                raise exceptions.UserError(
                    'Only new or cancelled properties can be deleted.'
                )
