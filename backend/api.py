import os

from flask import Flask, Response

from lhacks.services.usermanager import UserManager
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
 
app = Flask("lhacks-portal")

engine = create_engine(os.getenv("CONNECTION_STRING"), echo=True)

db = Session(engine)

userManager = UserManager(db)

@app.route("/register", ["POST"])
def Register():
    return Response(str(userManager.AddUser(userManager.CreateUser("foo@bar.com"))), 200)
