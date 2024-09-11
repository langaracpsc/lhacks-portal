from functools import wraps
from flask import request
from flask_cors import cross_origin
from inspect import signature, Parameter

from typing import Callable, Any

from lhacks.services.auth import verify_jwt, get_token_auth_header

def validate_jwt(callback: Callable[[str], Any] | None = None):
    def decorator(route):
        @wraps(route)
        @cross_origin()
        def decorated(*args, **kwargs):
            print("Request:", request.headers)

            # Check if it's a CORS preflight request
            if request.method == 'OPTIONS':
                return route(*args, **kwargs)

            token = get_token_auth_header()
            if isinstance(token, dict):
                return token, 401
            result = verify_jwt(token)
            if isinstance(result, dict) and "error" in result:
                return result, 401

            # Call the callback if provided
            if callback:
                cbResult = callback(token)
                if cbResult is not None:
                    return cbResult

            # Inject the token into kwargs if the function expects it
            sig = signature(route)
            if 'token' in sig.parameters:
                kwargs['token'] = token

            # Call the route function with all arguments
            return route(*args, **kwargs)

        # Apply cross_origin decorator

        return decorated
    return decorator
