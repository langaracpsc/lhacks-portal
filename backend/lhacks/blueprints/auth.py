import os
import sys
import json
import uuid

from os import environ as env
import lhacks.oauth as oauth
from lhacks.db import dbSession

from lhacks.services.usermanager import UserManager, User
from lhacks.services.auth import AuthManager, verify_jwt

from urllib.parse import quote_plus, urlencode
from flask import Blueprint, url_for, render_template, redirect, session

from jose import jwt

auth_bp = Blueprint("auth", __name__)

userManager = UserManager(dbSession)
authManager = AuthManager()

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

    return redirect(f"{os.getenv("CLIENT_URL")}/Callback/?uuid={session["sessionID"]}")

@auth_bp.route("/token/<string:uuid>")
def get_token(uuid: str):
    response = authManager.Login(uuid)

    if "error" in response:
        return response, 400 if response["type"] == 1 else 401 

    return response, 200
    
@auth_bp.route("/login")
def login():
  print("uri: ", url_for("auth.callback", _external=True))
  return oauth.oauth.auth0.authorize_redirect(
        redirect_uri = url_for("auth.callback", _external=True)
    )

@auth_bp.route("/logout")
def logout():
    session.clear()
    
    return redirect(
        "https://" + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("home", _external=True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )

@auth_bp.route("/")
def home():
   return render_template("home.html", session=session.get('user'), pretty=json.dumps(session.get('user'), indent=4))
 