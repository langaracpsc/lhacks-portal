import os
import sys

from lhacks.services.usermanager import UserManager

from flask import Blueprint, jsonify, request
from lhacks.db import dbSession
from lhacks.services.auth import get_token_auth_header, require_auth, verify_jwt
from lhacks.services.usermanager import UserManager
from lhacks.services.mealmanager import Meal, MealManager

meal_bp = Blueprint("meal", __name__)

userManager = UserManager(dbSession)

Manager = MealManager(dbSession)
@meal_bp.route("/", methods=["GET"])
# @require_auth(None)
def get_meals():
    # token = get_token_auth_header()
    # if isinstance(token, dict):
    #     return token  # Token is already an error response

    # payload = verify_jwt(token)
    # if isinstance(payload, dict) and 'error' in payload:
    #     return payload  # Payload is an error response
    return Manager.GetMeals(), 200


@meal_bp.route("/tokens/issue", methods=["POST"])
# @require_auth(None)
def issue_tokens():
    # token = get_token_auth_header()
    # if isinstance(token, dict):
    #     return token  # Token is already an error response

    # payload = verify_jwt(token)
    # if isinstance(payload, dict) and 'error' in payload:
    #     return payload  # Payload is an error response

    users = userManager.GetUsers()

    tokensCreated: int = 0

    meals: list[dict] = Manager.GetMeals()
    
    for user in users:
        for meal in meals:
            for _ in range(2):
                Manager.AddMealToken(Manager.
            CreateMealToken(user["ID"], meal["id"]))
            tokensCreated += 1

    return {"success": True, "tokens_created": tokensCreated}, 201


@meal_bp.route("/active", methods=["GET"])
@require_auth(None)
def get_active_meal():
    token = get_token_auth_header()
    if isinstance(token, dict):
        return token  # Token is already an error response

    payload = verify_jwt(token)

    if isinstance(payload, dict) and 'error' in payload:
        return payload  # Payload is an error response
    
    meal: dict = Manager.GetActiveMeal()

    return meal, 200


@meal_bp.route("/deactivate/<string:meal>", methods=["POST"])
# @require_auth(None)
def deactivate_meal(meal: str):
    meal: dict = Manager.DeactivateMeal(meal)

    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200

@meal_bp.route("/activate/<string:meal>", methods=["POST"])
# @require_auth(None)
def activate_meal(meal: str):
    meal: dict = Manager.ActivateMeal(meal)

    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200
    # token = get_token_auth_header()
    # if isinstance(token, dict):
    #     if ("error" in token.keys()):
    #         return token  # Token is already an error responsea

    # payload = verify_jwt(token)

    # if isinstance(payload, dict) and 'error' in payload:
    #     return payload  # Payload is an error response
    
    # user_id = payload.get('sub')

    # data = request.get_json()
    # if not data:
    #     return jsonify({"error": "No input data provided"}), 400

    # required_fields = ["email", "full_name"]
    # for field in required_fields:
    #     if field not in data:
    #         return jsonify({"error": f"Missing required field: {field}"}), 400
        # user = Manager.CreateUser(
        #     id=user_id,
        #     email=data["email"],
        #     full_name=data["full_name"],
        #     preferred_name=data["preferred_name"],
        #     dietary_restriction=data["dietary_restriction"],
        #     allergies=data["allergies"]
        # )

        # Manager.AddUser(user)

@meal_bp.route("/tokens/<string:email>", methods=["GET"])
def GetMealTokens(email: str):
    user = userManager.GetUserByEmail(email)

    if (user == None):
        return {"error": "User doesnt exist"}, 500

    tokens = Manager.GetMealTokens(user.ID)

    if (isinstance(tokens, dict) and "error" in tokens):
        return tokens, 500
    
    return tokens, 200

