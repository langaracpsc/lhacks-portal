import os
import sys

from lhacks.services.usermanager import UserManager

from flask import Blueprint, jsonify, request
from lhacks.db import dbSession
from lhacks.services.auth import get_token_auth_header, require_auth, verify_jwt
from lhacks.services.scanmanager import ScanManager
from lhacks.services.mealmanager import MealManager
from lhacks.schema.scan import Scan, ScanType

scan_bp = Blueprint("scan", __name__)

Manager = ScanManager(dbSession)

userManager = UserManager(dbSession)
mealManager = MealManager(dbSession)

@scan_bp.route("/create", methods=["POST"])
# @require_auth(None)
def create_scan():
    token = get_token_auth_header()

    if isinstance(token, dict):
        if ("error" in token.keys()):
            return token  # Token is already an error responsea

    payload = verify_jwt(token)

    if isinstance(payload, dict) and 'error' in payload:
        pass
        # return payload  # Payload is an error response
    
    # user_id = payload.get('sub')

    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["userid", "type"]
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    try:
        scan = Manager.CreateScan(data["userid"], int(data["type"]))

        if (scan.Type == ScanType.Meal.value):
            meal = mealManager.GetActiveMeal()

            if (meal == None):
               return {"error": "No active meal."}, 500  

            if ("meal" not in data):
               return {"error": "Meal name not provided for the scan."}, 500
          
            token = mealManager.SpendToken(data["userid"], meal["name"])
           
            if ("error" in token):
               return token, 500

        elif (scan.Type == ScanType.CheckIn.value):
            scans = Manager.GetScans(data["userid"], data["type"])

            if (len(scans) < 1):
                Manager.AddScan(Manager.CreateScan(data["userid"], int(data["type"])))
            else:
                return {"error": "User already checked in."}, 500
        
        Manager.AddScan(scan)
        
        return {"success": True, "message": "Scan created successfully", "scan": scan.ToDict() }, 201
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
@scan_bp.route("/filter/<string:email>/<int:type>", methods=["GET"])
def GetScans(email: str, type: int):
    user = userManager.GetUserByEmail(email)

    if (user == None):
        return {"error": "User doesn't exist"}, 500 

    scans = Manager.GetScansByUserID(user.ID, type)
    
    return { "scans": scans }


