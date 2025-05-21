# app/auth/schemas.py
from marshmallow import Schema, fields, validate, ValidationError

class InititatePaymentSchema(Schema):
    amount = fields.String(required=True, validate=validate.Length(min=2))
    customer_name = fields.String(required=True, validate=validate.Length(min=3))
    reference = fields.String(required=True, validate=validate.Length(min=3))
    customer_email = fields.Email(required=True)
 