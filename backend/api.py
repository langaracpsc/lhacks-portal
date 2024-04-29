import os

from flask import Flask, Response

from lhacks.services.usermanager import UserManager
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from lhacks.blueprints.auth import auth_bp

engine = create_engine(os.getenv("CONNECTION_STRING"), echo=True)

dbSession = Session(engine)

def create_app(): 
    app = Flask("lhacks-portal")

    app.register_blueprint(auth_bp, url_prefix="/auth") # auth routes beginning with /auth

    return app

# app = create_app() 