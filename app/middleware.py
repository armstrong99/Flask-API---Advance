from flask import request, abort, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def jwt_cookie_protect():
    if request.method == 'OPTIONS':
        return 

    if request.path.startswith('/api') and not request.path.startswith('/api/auth'):
        try:
            # Let Flask-JWT-Extended handle JWT verification
            verify_jwt_in_request(locations=["cookies"])
            current_user_id = get_jwt_identity()

            if not current_user_id:
                logger.warning("JWT identity missing.")
                abort(401, description="Invalid or missing identity")

            # Store in `g` or `request` depending on your app design
            logger.debug(f"Current User ID: {type(current_user_id)}")
            g.user_id = current_user_id  # ✅ Use `g` as discussed earlier
        except Exception as e:
            logger.warning(f"JWT Error: {str(e)}")
            abort(401, description=f"Unauthorized: {str(e)}")