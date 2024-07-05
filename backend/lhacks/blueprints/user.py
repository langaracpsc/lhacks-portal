import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from lhacks.services.usermanager import UserManager

from flask import Blueprint, jsonify, request
from lhacks.db import dbSession
from lhacks.services.auth import get_token_auth_header, require_auth, verify_jwt
from lhacks.services.usermanager import UserManager

user_bp = Blueprint("user", __name__)

Manager = UserManager(dbSession)


@user_bp.route("/", methods=["GET"])
@require_auth(None)
def get_user_info():
    token = get_token_auth_header()
    if isinstance(token, dict):
        return token  # Token is already an error response

    payload = verify_jwt(token)
    if isinstance(payload, dict) and 'error' in payload:
        return payload  # Payload is an error response
    
    user_id = payload.get('sub')

    user_info = Manager.GetUserInfo(user_id)
    if "error" in user_info:
        return jsonify(user_info), 404

    return jsonify(user_info), 200


@user_bp.route("/", methods=["POST"])
@require_auth(None)
def create_user():
    token = get_token_auth_header()
    if isinstance(token, dict):
        return token  # Token is already an error responsea

    payload = verify_jwt(token)
    if isinstance(payload, dict) and 'error' in payload:
        return payload  # Payload is an error response
    
    
    user_id = payload.get('sub')

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["email", "full_name"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    try:
        user = Manager.CreateUser(
            id=user_id,
            email=data["email"],
            full_name=data["full_name"],
            preferred_name=data["preferred_name"],
            dietary_restriction=data["dietary_restriction"],
            allergies=data["allergies"]
        )
        Manager.AddUser(user)
        return jsonify({"message": "User added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/test")
@require_auth(None)
def test():
    token = get_token_auth_header()
    if isinstance(token, dict):
        return token  # Token is already an error responsea

    payload = verify_jwt(token)
    if isinstance(payload, dict) and 'error' in payload:
        return payload  # Payload is an error response
    
    return jsonify(payload)