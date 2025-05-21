from ..extensions import db
from datetime import datetime
from sqlalchemy import ForeignKey, Index

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(12,2), nullable=False)
    transaction_id = db.Column(db.String, nullable=False)
    status = db.Column(db.Enum('PENDING','PAID','FAILED', name='txn_status'), nullable=False, index=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False, index=True)

    user = db.relationship('User', back_populates='transactions')

Index('ix_txn_user_ts', Transaction.user_id, Transaction.timestamp)  # composite index :contentReference[oaicite:6]{index=6}
