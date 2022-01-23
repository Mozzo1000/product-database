from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify
from functools import wraps

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["role"] == "admin":
                return fn(*args, **kwargs)
            else:
                return jsonify({'error': 'Permission denied', 'message': 'You do not have the required permission.'}), 403
        return decorator
    return wrapper
