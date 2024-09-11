import json
import time
import uuid

from urllib.request import urlopen
from authlib.oauth2.rfc7523 import JWTBearerTokenValidator
from authlib.jose.rfc7517.jwk import JsonWebKey
from authlib.jose.errors import JoseError

from authlib.integrations.flask_oauth2 import ResourceProtector
from lhacks.config import AUTH0_DOMAIN, AUTH0_API_IDENTIFIER, ALGORITHMS
from lhacks.logger import logger
from flask import request, jsonify
from jose import jwt, JWTError


# Function to handle authorization errors
def auth_error(description, status_code):
    response = jsonify({"error": description})
    response.status_code = status_code
    return response


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


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
                "e": key["e"],
            }
    return None


# Function to verify the JWT
def verify_jwt(token):
    try:
        unverified_header = jwt.get_unverified_header(token)

        print("unverified: ", unverified_header)

        rsa_key = get_rsa_key(unverified_header["kid"])

        if not rsa_key:
            return auth_error("Unable to find appropriate key", 401)

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=AUTH0_API_IDENTIFIER,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )

        return payload

    except jwt.ExpiredSignatureError:
        return auth_error("Token is expired", 401)

    except jwt.JWTClaimsError:
        return auth_error("Incorrect claims, please check the audience and issuer", 401)

    except Exception:
        return auth_error("Unable to parse authentication token", 401)


def get_token_auth_header():
    auth = request.headers.get("Authorization", None)

    if not auth:
        raise AuthError(
            {
                "code": "authorization_header_missing",
                "description": "Authorization header is expected",
            },
            401,
        )

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must start with Bearer",
            },
            401,
        )
    elif len(parts) == 1:
        raise AuthError(
            {"code": "invalid_header", "description": "Token not found"}, 401
        )
    elif len(parts) > 2:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Authorization header must be Bearer token",
            },
            401,
        )

    token = parts[1]

    return token


class Auth0JWKSClient:
    def __init__(self, domain):
        self.domain = domain
        self.jwks = None

    def get_jwks(self):
        if self.jwks is None:
            jwks_url = f"https://{self.domain}/.well-known/jwks.json"
            with urlopen(jwks_url) as response:
                self.jwks = json.loads(response.read())
        return self.jwks

    def get_key(self, kid):
        jwks = self.get_jwks()
        for key in jwks["keys"]:
            if key["kid"] == kid:
                return JsonWebKey.import_key(key)
        return None


jwks_client = Auth0JWKSClient(AUTH0_DOMAIN)


class Auth0JWTBearerTokenValidator(JWTBearerTokenValidator):
    def __init__(self, domain, audience):
        issuer = f"https://{domain}/"
        jwks_url = f"{issuer}.well-known/jwks.json"
        logger.info(f"Fetching JWKS from: {jwks_url}")

        try:
            with urlopen(jwks_url) as response:
                jwks = json.loads(response.read())

            public_key = JsonWebKey.import_key_set(jwks)
        except Exception as e:
            logger.error(f"Error fetching or parsing JWKS: {str(e)}")
            raise

        super(Auth0JWTBearerTokenValidator, self).__init__(public_key)

        self.claims_options = {
            "exp": {"essential": True},
            "aud": {"essential": True, "value": audience},
            "iss": {"essential": True, "value": issuer},
        }

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(AUTH0_DOMAIN, AUTH0_API_IDENTIFIER)

require_auth.register_token_validator(validator)

class AuthManager:
    def InsertToken(self, token: str, user: dict) -> str | None:
        sessionID: str = str(uuid.uuid4())

        obj = { "token": token, "sessionID": sessionID, "user": user }

        self.JwtLookup[token] = obj
        self.Inactive[sessionID] = obj

        return obj

    def Login(self, sessionID: str) -> dict:
        print(f"Login called for {sessionID}")
        print(f"Inactive: {json.dumps(self.Inactive, indent=2)}")

        print("JwtLookup: ", json.dumps(self.JwtLookup, indent=2))

        if sessionID in self.Inactive:
            session = self.Inactive[sessionID]

            self.LoggedIn[sessionID] = self.Inactive[sessionID]

            self.Inactive.pop(sessionID)

            return session

        # elif (sessionID in self.LoggedIn):
        #     return { "error": "Already logged in.", "type": 0 }
        return {"error": "Invalid session id.", "type": 1}

    def GetTokenBySession(self, session: str) -> dict | None:
        if not (session in self.LoggedIn):
            return None

        return self.LoggedIn[session]

    def LookUpToken(self, token: str) -> dict | None:
        try:
            print("JwtLookup: ", json.dumps(self.JwtLookup, indent=2))
            return self.JwtLookup[token]
        except KeyError:
            return None

    def __init__(self):
        self.LoggedIn: dict[str, str] = {}
        self.Inactive: dict[str, str] = {}
        self.JwtLookup: dict[str, str] = {}


authManager = AuthManager()

def HandleLookup(token):
    if not authManager.LookUpToken(token):
        return {"error": "Invalid access token."}, 401
