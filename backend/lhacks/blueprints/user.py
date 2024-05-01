import os
import sys
import json

from os import environ as env

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from lhacks.services.usermanager import UserManager

from urllib.parse import quote_plus, urlencode
from flask import Blueprint, url_for, render_template, redirect, session
from lhacks.db import dbSession

user_bp = Blueprint("user", __name__)

Manager = UserManager(dbSession)

@user_bp.route("<id>")
def GetUser(id: str): 
    return 

