import os
import logging
from flask import Flask
from logging.handlers import RotatingFileHandler
from flask_cors import CORS

from .config import DevConfig, ProdConfig
from .extensions import db, migrate, jwt
from .auth.routes import auth_bp
from .users.routes import users_bp
from .transactions.routes import tx_bp
from .middleware import jwt_cookie_protect

def create_app():
    app = Flask(__name__)

    # Select config based on environment variable
    flask_env = os.environ.get('FLASK_ENV', 'development')
    if flask_env == 'production':
        app.config.from_object(ProdConfig)
    else:
        app.config.from_object(DevConfig)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # JWT middleware for protected routes
    app.before_request(jwt_cookie_protect)

    # Enable CORS (with credentials support)
    # Configure CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:3000",
                "supports_credentials": True,
                "allow_headers": ["Content-Type", "Authorization"],
                "methods": ["GET", "PUT", "POST", "DELETE", "OPTIONS"]
            }
        }
    )

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(tx_bp, url_prefix='/api/transactions')

    # Logging setup
    handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
    formatter = logging.Formatter("[%(asctime)s] %(levelname)s in %(module)s: %(message)s")
    handler.setFormatter(formatter)
    handler.setLevel(logging.DEBUG)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.DEBUG)

    app.logger.info("Flask app started")

    return app
