# monnify_utils.py
import os
import base64
import logging
import requests
from dotenv import load_dotenv
from ..config import App_configuration

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_basic_auth_header():
    auth_str = f"{App_configuration.MONNIFY_API_KEY}:{App_configuration.MONNIFY_SECRET_KEY}"
    encoded = base64.b64encode(auth_str.encode()).decode()
    print(f"Encoded auth string: {encoded}")  # Debugging line
    return {"Authorization": f"Basic {encoded}"}

def initialize_payment(amount, customer_email, customer_name, reference):
    logger.debug(App_configuration.MONNIFY_API_KEY, App_configuration.CONTRACT_CODE, App_configuration.MONNIFY_SECRET_KEY, App_configuration.MONNIFY_BASE_URL)
    url = f"{App_configuration.MONNIFY_BASE_URL}/v1/merchant/transactions/init-transaction"


  
    payload = {
        "amount": amount,
        "customerEmail": customer_email,
        "customerName": customer_name,
        "paymentReference": reference,
        "paymentDescription": "Payment for service",
        "currencyCode": "NGN",
        "contractCode": App_configuration.CONTRACT_CODE,
        "redirectUrl": "http://localhost:5001/api/transactions/payment/callback",  # Your callback URL
        "taskRef": reference
    }

    logger.debug(payload, "payload")

    headers = get_basic_auth_header()
    headers["Content-Type"] = "application/json"

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return data['responseBody']['checkoutUrl']
    else:
        raise Exception(f"Failed to initialize payment: {response.text}")