import os
import sys

from lhacks.services.usermanager import UserManager

from flask_cors import cross_origin
from flask import Blueprint, jsonify, request

from lhacks.db import dbSession
from lhacks.services.auth import get_token_auth_header, require_auth, verify_jwt
from lhacks.services.usermanager import UserManager
from lhacks.services.scanmanager import ScanManager

user_bp = Blueprint("user", __name__)

Manager = UserManager(dbSession)

scanManager = ScanManager(dbSession)

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
        if ("error" in token.keys()):
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

@user_bp.route("/checkedin/<string:email>", methods=["GET"])
@cross_origin()
def is_user_checked_in(email: str):
    user = Manager.GetUserByEmail(email)

    if (user == None):
        return { "error": "User doesn't exist." }

    scans = scanManager.GetScans(user.ID, 0)

    if (len(scans) > 0):
        return {"checked_in": True, "scan": scans[0]}, 200
        
    return {"checked_in": False }, 200
