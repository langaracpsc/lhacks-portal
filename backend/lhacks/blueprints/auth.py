import os
import sys
import json
import uuid

from os import environ as env
import lhacks.oauth as oauth
from lhacks.db import dbSession
from flask_cors import cross_origin

from lhacks.services.usermanager import UserManager, User
from lhacks.services.auth import AuthManager, authManager, HandleLookup, get_token_auth_header, verify_jwt
from lhacks.decorators.validate_jwt import validate_jwt

from flask import Blueprint, url_for, render_template, redirect, session, request

auth_bp = Blueprint("auth", __name__)

userManager = UserManager(dbSession)

@auth_bp.route("/test", methods=["POST"])
def test():
    return request

@auth_bp.route("/callback", methods=["GET", "POST"])
def callback():
    tokenInfo = oauth.oauth.auth0.authorize_access_token()

    userInfo: dict = tokenInfo["userinfo"]

    token: str = tokenInfo["access_token"]

    verfied = verify_jwt(tokenInfo["access_token"])

    if not verfied:
        return {"error": "Invalid token"}, 401

    user: User | None = userManager.GetUserByEmail(userInfo["email"])

    if (user == None):
        user = userManager.AddUser(userManager.CreateUser(
            userInfo["email"],
            userInfo["name"]
        ))

    session: dict = authManager.InsertToken(token, user.ToDict())

    return redirect(f"{os.getenv("CLIENT_URL")}/callback/?uuid={session["sessionID"]}")

@auth_bp.route("/token/<string:uuidStr>")
@cross_origin()
def get_token(uuidStr: str):
    response = authManager.Login(uuidStr)

    if "error" in response:
        print(response)
        return response, 400 if response["type"] == 1 else 401

    return response, 200

@auth_bp.route("/login")
def login():
  print("uri: ", url_for("auth.callback", _external=True))
  return oauth.oauth.auth0.authorize_redirect(
        redirect_uri = url_for("auth.callback", _external=True)
    )

@validate_jwt(HandleLookup)
@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    token = get_token_auth_header()

    if isinstance(token, dict):
        return token, 401

    try:
        print(f"Got token: {token}")
        print(f"Contains: {token in authManager.JwtLookup}")

        authManager.JwtLookup.pop(token)
        print(f"Contains after pop: {token in authManager.JwtLookup}")
    except Exception as e:
        return { "error": e }, 500

    return {"success": True}, 200
