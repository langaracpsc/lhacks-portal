import json
import os
import sys

from lhacks.services.usermanager import UserManager

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from lhacks.db import dbSession
from lhacks.services.auth import (
    HandleLookup,
    get_token_auth_header,
    require_auth,
    verify_jwt,
)
from lhacks.decorators.validate_jwt import validate_jwt
from lhacks.services.auth import authManager
from lhacks.services.scanmanager import ScanManager
from lhacks.services.mealmanager import MealManager
from lhacks.services.socketsessionmanager import SocketSession, socketSessionManager

from lhacks.schema.scan import Scan, ScanType

import lhacks.sockets.globals as socket

scan_bp = Blueprint("scan", __name__)

Manager = ScanManager(dbSession)

userManager = UserManager(dbSession)
mealManager = MealManager(dbSession)


@validate_jwt(HandleLookup)
@scan_bp.route("/create", methods=["POST"])
@cross_origin()
def CreateScan():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400
    required_fields = ["userid", "type"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    token = get_token_auth_header()

    if isinstance(token, dict):
        return token, 401

    try:
        user: dict | None = authManager.LookUpToken(token)["user"]

        if user["Role"] > 1:
            print(user)
            return {"error": "Not enough privilages."}, 403

    except Exception as e:
        return {"error": "Invalid token."}, 403

    try:
        scan = Manager.CreateScan(data["userid"], int(data["type"]))

        if scan.Type == ScanType.Meal.value:
            meal = mealManager.GetActiveMeal()

            if meal == None:
                return {"error": "No active meal."}, 500

            if "meal" not in data:
                return {"error": "Meal name not provided for the scan."}, 500

            token = mealManager.SpendToken(data["userid"], meal["name"])

            if "error" in token:
                return token, 500

        elif scan.Type == ScanType.CheckIn.value:
            scans = Manager.GetScans(data["userid"], data["type"])

            if len(scans) < 1:
                Manager.AddScan(Manager.CreateScan(data["userid"], int(data["type"])))
            else:
                return {"error": "User already checked in."}, 500

        socketSession: SocketSession | None = socketSessionManager.GetSessionByUser(
            data["userid"]
        )

        socketSession.Emit("response", json.dumps({"scan": True}))

        Manager.AddScan(scan)

        return {
            "success": True,
            "message": "Scan created successfully",
            "scan": scan.ToDict(),
        }, 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@validate_jwt(HandleLookup)
@scan_bp.route("/filter/<string:email>/<int:type>", methods=["GET"])
@cross_origin()
def GetScans(email: str, type: int):
    user = userManager.GetUserByEmail(email)

    if user == None:
        return {"error": "User doesn't exist"}, 500

    scans = Manager.GetScansByUserID(user.ID, type)

    return {"scans": scans}
