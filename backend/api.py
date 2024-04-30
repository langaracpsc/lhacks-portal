import json

from os import environ as env
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from lhacks.services.usermanager import UserManager
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from flask import Flask,redirect, render_template, session, url_for
import lhacks.oauth as oauth  
from lhacks.blueprints.auth import auth_bp

engine = create_engine(env.get("CONNECTION_STRING"), echo=True)

dbSession = Session(engine)

def create_app():
    app = Flask("lhacks-portal")

    app.secret_key = env.get("APP_SECRET_KEY")

    oauth.oauth = OAuth(app)

    oauth.oauth.register(
        "auth0",
        client_id=env.get("AUTH0_CLIENT_ID"),
        client_secret=env.get("AUTH0_CLIENT_SECRET"),
        client_kwargs={
            "scope": "openid profile email",
        },
        server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
    )   
    
    app.register_blueprint(auth_bp, url_prefix="/auth") # auth routes beginning with /auth

    return app