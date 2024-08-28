import os
import sys
import json
import uuid

from os import environ as env
import lhacks.oauth as oauth
from lhacks.db import dbSession
from flask_cors import cross_origin

from lhacks.services.usermanager import UserManager, User
from lhacks.services.auth import AuthManager, authManager, HandleLookup, verify_jwt
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

@auth_bp.route("/token/<string:uuid>")
@cross_origin()
def get_token(uuid: str):
    response = authManager.Login(uuid)

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
def logout(token: str):
    session.clear()
    authManager.JwtLookup.pop(token)
 
    return { "success": True }, 200
