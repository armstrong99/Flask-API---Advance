import os
basedir = os.path.abspath(os.path.dirname(__file__))

class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MONNIFY_API_KEY = os.getenv("MONNIFY_API_KEY")
    MONNIFY_SECRET_KEY = os.getenv("MONNIFY_SECRET_KEY")
    MONNIFY_BASE_URL = os.getenv("MONNIFY_SANDBOX_URL")
    CONTRACT_CODE = os.getenv("MONNIFY_CONTRACT_CODE")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"
    JWT_REFRESH_COOKIE_NAME = "refresh_token_cookie"
    JWT_COOKIE_SECURE = False  # True in production with HTTPS
    JWT_COOKIE_CSRF_PROTECT = False

class ProdConfig(BaseConfig):
    DEBUG = False

class DevConfig(BaseConfig):
    DEBUG = True

App_configuration = ProdConfig if os.getenv('FLASK_ENV') =='production' else DevConfig
