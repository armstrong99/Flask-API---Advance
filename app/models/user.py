from ..extensions import db
from datetime import datetime
from sqlalchemy import Index
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(128), nullable=False, index=True)
    email = db.Column(db.String(128), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    wallet_balance = db.Column(db.Numeric(12,2), default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    transactions = db.relationship('Transaction', back_populates='user', lazy='dynamic')

    def set_password(self, pw): self.password_hash = generate_password_hash(pw, method='pbkdf2:sha256')
    def check_password(self, pw): return check_password_hash(self.password_hash, pw)
    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "wallet_balance": float(self.wallet_balance),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

Index('ix_user_email', User.email)  # explicit index :contentReference[oaicite:5]{index=5}
