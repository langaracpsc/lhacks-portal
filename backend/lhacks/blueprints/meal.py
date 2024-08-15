import os
import sys

from lhacks.services.usermanager import UserManager

from flask import Blueprint, jsonify, request
from lhacks.db import dbSession

from lhacks.decorators.validate_jwt import validate_jwt
from lhacks.services.auth import get_token_auth_header, require_auth, verify_jwt
from lhacks.services.usermanager import UserManager
from lhacks.services.mealmanager import Meal, MealManager
from lhacks.services.auth import authManager

meal_bp = Blueprint("meal", __name__)

userManager = UserManager(dbSession)

Manager = MealManager(dbSession)

@meal_bp.route("/", methods=["GET"])
def get_meals():
    token = get_token_auth_header()
    
    # payload = ValidateJwtRequest(token)

    # if (isinstance(payload, dict) and ("error" in payload)):
    #     return payload, 401


    return Manager.GetMeals(), 200

@meal_bp.route("/tokens/issue", methods=["POST"])
def issue_tokens():
    # token = get_token_auth_header()
    
    # if (isinstance(payload, dict) and ("error" in payload)):
    #     return payload, 401

    users = userManager.GetUsers()

    tokensCreated: int = 0

    meals: list[dict] = Manager.GetMeals()
    
    for user in users:
        for meal in meals:
            for _ in range(2):
                Manager.AddMealToken(Manager.CreateMealToken(user["ID"], meal["id"]))

            tokensCreated += 1

    return {"success": True, "tokens_created": tokensCreated}, 201

@meal_bp.route("/active", methods=["GET"])
@validate_jwt()
def get_active_meal(token):
    if (not authManager.LookUpToken(token)):
        return { "error": "Invalid access token." }, 401

    meal: dict | None = Manager.GetActiveMeal()

    if (meal == None):
        return { "error": "No active meal" }, 500

    return meal, 200

def HandleLookup(token):
    if (not authManager.LookUpToken(token)):
        return { "error": "Invalid access token." }, 401

@meal_bp.route("/deactivate/<string:meal>", methods=["POST"])
@validate_jwt(HandleLookup)
def deactivate_meal(meal: str, token):
    meal: dict = Manager.DeactivateMeal(meal)
    
    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200

@meal_bp.route("/activate/<string:meal>", methods=["POST"])
def activate_meal(meal: str):
    token = get_token_auth_header()
    
    # payload = ValidateJwtRequest(token)

    # if (isinstance(payload, dict) and ("error" in payload)):
    #     return payload, 401

    meal: dict = Manager.ActivateMeal(meal)

    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200

@meal_bp.route("/tokens/<string:email>", methods=["GET"])
def GetMealTokens(email: str):
    token = get_token_auth_header()
    
    # payload = ValidateJwtRequest(token)

    # if (isinstance(payload, dict) and ("error" in payload)):
    #     return payload, 401

    user = userManager.GetUserByEmail(email)

    if (user == None):
        return {"error": "User doesnt exist"}, 500

    tokens = Manager.GetMealTokens(user.ID)

    if (isinstance(tokens, dict) and "error" in tokens):
        return tokens, 500
    
    return tokens, 200

