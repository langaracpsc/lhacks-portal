import os
import sys
import json

from os import environ as env

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

import lhacks.oauth as oauth
from urllib.parse import quote_plus, urlencode
from flask import Blueprint, url_for, render_template, redirect, session

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.oauth.auth0.authorize_access_token()

    session["user"] = token

    return redirect("/")

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
 
