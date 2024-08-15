from functools import wraps
from flask import request

from typing import Optional

from lhacks.services.auth import verify_jwt, get_token_auth_header

def validate_jwt():
    def decorator(route):
        @wraps(route)
        def decorated(*args, **kwargs):
            token = get_token_auth_header()
            if isinstance(token, dict):
                return token, 401

            result = verify_jwt(token)
            if isinstance(result, dict) and "error" in result:
                return result, 401

            # Inject the token into kwargs
            kwargs["token"] = token

            # Call the route function with all arguments
            return route(*args, **kwargs)

        return decorated

    return decorator
