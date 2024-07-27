import json

from urllib.request import urlopen
from authlib.oauth2.rfc7523 import JWTBearerTokenValidator
from authlib.jose.rfc7517.jwk import JsonWebKey
from authlib.integrations.flask_oauth2 import ResourceProtector
from lhacks.config import AUTH0_DOMAIN, AUTH0_API_IDENTIFIER, ALGORITHMS
from flask import request, jsonify
from jose import jwt

# Function to handle authorization errors
def auth_error(description, status_code):
    response = jsonify({"error": description})
    response.status_code = status_code
    return response

# Function to get the token from the Authorization header
def get_token_auth_header():
    auth = request.headers.get("Authorization", None)
    if not auth:
        return auth_error("Authorization header is expected", 401)
    
    parts = auth.split()
    if parts[0].lower() != "bearer":
        return auth_error("Authorization header must start with Bearer", 401)
    elif len(parts) == 1:
        return auth_error("Token not found", 401)
    elif len(parts) > 2:
        return auth_error("Authorization header must be Bearer token", 401)

    return parts[1]

# Function to get the public key from Auth0
def get_rsa_key(kid):
    jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read())

    for key in jwks["keys"]:
        if key["kid"] == kid:
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    return None

# Function to verify the JWT
def verify_jwt(token):
    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = get_rsa_key(unverified_header['kid'])
        if not rsa_key:
            return auth_error("Unable to find appropriate key", 401)
        
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=AUTH0_API_IDENTIFIER,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    except jwt.ExpiredSignatureError:
        return auth_error("Token is expired", 401)
    except jwt.JWTClaimsError:
        return auth_error("Incorrect claims, please check the audience and issuer", 401)
    except Exception:
        return auth_error("Unable to parse authentication token", 401)

class Auth0JWTBearerTokenValidator(JWTBearerTokenValidator):
    def __init__(self, domain, audience):
        issuer = f"https://{domain}/"
        jsonurl = urlopen(f"{issuer}.well-known/jwks.json")
        public_key = JsonWebKey.import_key_set(
            json.loads(jsonurl.read())
        )
        super(Auth0JWTBearerTokenValidator, self).__init__(
            public_key
        )
        self.claims_options = {
            "exp": {"essential": True},
            "aud": {"essential": True, "value": audience},
            "iss": {"essential": True, "value": issuer},
        }
        

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(AUTH0_DOMAIN, AUTH0_API_IDENTIFIER)
require_auth.register_token_validator(validator)

class AuthManager:
    def __init__(self):
        self.JwtLookup: dict[str, str] = {}
