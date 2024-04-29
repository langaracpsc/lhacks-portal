import os

from flask import Flask, Response

from lhacks.services.usermanager import UserManager
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

class Controller: 
    app = Flask("lhacks-portal")

    engine = create_engine(os.getenv("CONNECTION_STRING"), echo=True)

    db = sessionmaker(bind=engine)

    userManager = UserManager(db)

    @app.route("/")
    def Get():
        return "Hello World"