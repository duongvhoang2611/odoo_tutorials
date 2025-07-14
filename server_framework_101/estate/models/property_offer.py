from odoo import models, fields, api, exceptions
from datetime import timedelta


class PropertyOffer(models.Model):
    _name = 'estate.property.offer'
    _description = 'The Real Estate Property Offer'
    _order = 'price desc'

    price = fields.Float('Price')
    status = fields.Selection(
        selection=[('accepted', 'Accepted'), ('refused', 'Refused')],
        string='Status',
        copy=False,
        help='Please select an option',
    )
    partner_id = fields.Many2one('res.partner', string='Partner', required=True)
    property_id = fields.Many2one('estate.property', string='Property', required=True)
    property_type_id = fields.Many2one(
        'estate.property.type',
        string='Property Type',
        related='property_id.property_type_id',
        store=True,
    )
    validity = fields.Integer(
        'Validity (Days)',
        compute='_compute_validity',
        inverse='_inverse_validity',
        store=True,
        default=7,
    )
    date_deadline = fields.Date(
        'Date deadline',
        compute='_compute_date_deadline',
        inverse='_inverse_date_deadline',
        store=True,
    )
    is_offer_accepted = fields.Boolean(
        'Is offer accepted', compute='_compute_is_offer_accepted'
    )

    _sql_constraints = [
        (
            'positive_price',
            'CHECK(price > 0)',
            'An offer price must be strictly positive.',
        ),
    ]

    @api.depends('validity')
    def _compute_date_deadline(self):
        for record in self:
            if record.validity:
                record.date_deadline = fields.Date.today() + timedelta(
                    days=record.validity
                )

    def _inverse_date_deadline(self):
        for record in self:
            if record.date_deadline:
                record.validity = (record.date_deadline - fields.Date.today()).days

    @api.depends('date_deadline')
    def _compute_validity(self):
        for record in self:
            if record.date_deadline:
                record.validity = (record.date_deadline - fields.Date.today()).days

    def _inverse_validity(self):
        for record in self:
            if record.validity:
                record.date_deadline = fields.Date.today() + timedelta(
                    days=record.validity
                )

    def action_accept(self):
        for record in self:
            record.status = 'accepted'
            record.property_id.selling_price = record.property_id.best_price
            record.property_id.buyer_id = record.partner_id
            record.property_id.state = 'offer_accepted'

    def action_refuse(self):
        for record in self:
            record.status = 'refused'

    @api.depends('property_id.state')
    def _compute_is_offer_accepted(self):
        for record in self:
            record.is_offer_accepted = record.property_id.state == 'offer_accepted'

    @api.model
    def create(self, vals_list):
        property_id = vals_list.get('property_id')
        property_obj = self.env['estate.property'].browse(property_id)

        existing_offers = property_obj.offer_ids

        for offer in existing_offers:
            if vals_list.get('price') < offer.price:
                raise exceptions.UserError(
                    'Offer price must be higher than existing offers.'
                )

        property_obj.state = 'offer_received'

        return super().create(vals_list)
