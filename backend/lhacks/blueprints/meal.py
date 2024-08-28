import os
import sys

from lhacks.services.usermanager import UserManager

from flask import Blueprint
from flask_cors import cross_origin
from lhacks.db import dbSession

from lhacks.services.auth import HandleLookup
from lhacks.decorators.validate_jwt import validate_jwt
from lhacks.services.usermanager import UserManager
from lhacks.services.mealmanager import Meal, MealManager
from lhacks.services.auth import authManager

meal_bp = Blueprint("meal", __name__)
 
userManager = UserManager(dbSession)

Manager = MealManager(dbSession)

@validate_jwt(HandleLookup)
@meal_bp.route("/", methods=["GET"])
def get_meals(token):
    return Manager.GetMeals(), 200

@cross_origin
@validate_jwt(HandleLookup)
@meal_bp.route("/tokens/issue", methods=["POST"])
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

@validate_jwt(HandleLookup)
@meal_bp.route("/active", methods=["GET"])
@cross_origin()
def get_active_meal():
    meal: dict | None = Manager.GetActiveMeal()

    if (meal == None):
        return { "error": "No active meal" }, 500

    return meal, 200

@validate_jwt(HandleLookup)
@meal_bp.route("/deactivate/<string:meal>", methods=["POST"])
@cross_origin()
def deactivate_meal(meal: str, token):
    meal: dict = Manager.DeactivateMeal(meal)
    
    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200

@cross_origin()
@validate_jwt(HandleLookup)
@meal_bp.route("/activate/<string:meal>", methods=["POST"])
def activate_meal(meal: str, token):
    meal: dict = Manager.ActivateMeal(meal)

    if ("error" in meal.keys()):
        return meal, 500

    return meal, 200

@validate_jwt(HandleLookup)
@meal_bp.route("/tokens/<string:email>", methods=["GET"])
@cross_origin()
def GetMealTokens(email: str):
    user = userManager.GetUserByEmail(email)

    if (user == None):
        return {"error": "User doesnt exist"}, 500

    tokens = Manager.GetMealTokens(user.ID)

    if (isinstance(tokens, dict) and "error" in tokens):
        return tokens, 500
    
    return tokens, 200

