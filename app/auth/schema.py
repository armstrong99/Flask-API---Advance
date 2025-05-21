# app/auth/schemas.py
from marshmallow import Schema, fields, validate, ValidationError

class RegisterSchema(Schema):
    full_name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=5))
    phone = fields.String(validate=validate.Regexp(r'^\+?[1-9]\d{7,14}$'))