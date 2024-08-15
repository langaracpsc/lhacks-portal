import os
import sys

from lhacks.services.usermanager import UserManager

from flask import Blueprint
from lhacks.db import dbSession

from lhacks.services.auth import HandleLookup, validate_jwt
from lhacks.services.usermanager import UserManager
from lhacks.services.mealmanager import Meal, MealManager
from lhacks.services.auth import authManager

meal_bp = Blueprint("meal", __name__)

userManager = UserManager(dbSession)

Manager = MealManager(dbSession)

@meal_bp.route("/", methods=["GET"])
@validate_jwt(HandleLookup)
def get_meals():

    return Manager.GetMeals(), 200

@meal_bp.route("/tokens/issue", methods=["POST"])
@validate_jwt(HandleLookup)
def issue_tokens():
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
@validate_jwt(HandleLookup)
def get_active_meal(token):
    if (not authManager.LookUpToken(token)):
        return { "error": "Invalid access token." }, 401

    meal: dict | None = Manager.GetActiveMeal()

    if (meal == None):
        return { "error": "No active meal" }, 500

    return meal, 200

@meal_bp.route("/deactivate/<string:meal>", methods=["POST"])
@validate_jwt(HandleLookup)
def deactivate_meal(meal: str, token):
    meal: dict = Manager.DeactivateMeal(meal)
    
    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200

@meal_bp.route("/activate/<string:meal>", methods=["POST"])
@validate_jwt(HandleLookup)
def activate_meal(meal: str):
    meal: dict = Manager.ActivateMeal(meal)

    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200

@meal_bp.route("/tokens/<string:email>", methods=["GET"])
@validate_jwt(HandleLookup)
def GetMealTokens(email: str):
    user = userManager.GetUserByEmail(email)

    if (user == None):
        return {"error": "User doesnt exist"}, 500

    tokens = Manager.GetMealTokens(user.ID)

    if (isinstance(tokens, dict) and "error" in tokens):
        return tokens, 500
    
    return tokens, 200

