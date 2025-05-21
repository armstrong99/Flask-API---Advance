from flask import Blueprint, request, jsonify, current_app, g
from ..models.transaction import Transaction
from ..models.user import User
from ..extensions import db
from ..utils.monify import initialize_payment
from .schema import InititatePaymentSchema
from marshmallow import ValidationError
from ..config import App_configuration
from ..utils.monify import get_basic_auth_header
import requests
from datetime import datetime



tx_bp = Blueprint('transactions', __name__)

@tx_bp.route('/', methods=['GET'])
def history():
    txs = Transaction.query.filter_by(user_id=g.user_id).order_by(Transaction.timestamp.desc()).all()
    return jsonify([{
        'id': t.id, 'amount': str(t.amount), 'status': t.status, 'date': t.timestamp.isoformat()
    } for t in txs], wallet_balance=str(User.query.get(g.user_id).wallet_balance))


@tx_bp.route('/initialize-payment', methods=['POST'])
def init_payment():
    try:
        data = InititatePaymentSchema().load(request.json)

        print(data, "data")
    
        checkout_url = initialize_payment(
            amount=data['amount'],
            customer_email=data['customer_email'],
            customer_name=data['customer_name'],
            reference=data['reference']
        )
        return jsonify(checkout_url=checkout_url), 200
    except Exception as e:
        return jsonify(error=str(e)), 400
         

@tx_bp.route('/payment/callback', methods=['GET'])
def payment_callback():
    transaction_reference = request.args.get('paymentReference')
    print(transaction_reference, "transaction_reference")

    # Call Monnify to verify the transaction
    url = f"{App_configuration.MONNIFY_BASE_URL}/v1/transactions/{transaction_reference}"
    headers = get_basic_auth_header()

    response = requests.get(url, headers=headers)

    print(response.status_code, "response")

    if response.status_code == 200:
        tx_data = response.json()['responseBody']

        if tx_data['paymentStatus'] == 'PAID':
            user = User.query.filter_by(email=tx_data['customer']['email']).first_or_404()
            if not user:
                    # report error
                    return jsonify(msg="Bad credentials"), 401
            
            # Save to database
            print(tx_data, "tx_data")
            new_transaction = Transaction(
                transaction_id=tx_data['paymentReference'],
                amount=tx_data['amountPaid'],
                status='completed',
                user_id=user.id,
                timestamp=datetime.utcnow()
            )
            db.session.add(new_transaction)
            db.session.commit()

            return "<h1>Payment Successful!</h1>"
        else:
            return "<h1>Payment Failed</h1>"
    else:
        return "<h1>Error confirming payment</h1>"