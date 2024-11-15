import json
from ssl import socket_error
import lhacks.oauth as oauth
from os import environ as env
from authlib.integrations.flask_client import OAuth
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from lhacks.services.socketsessionmanager import SocketSession, socketSessionManager
from lhacks.blueprints.auth import auth_bp
from lhacks.blueprints.user import user_bp
from lhacks.blueprints.scan import scan_bp
from lhacks.blueprints.meal import meal_bp
from lhacks.config import load_environment_variables
from OpenSSL import SSL
import logging
import lhacks.sockets.globals as socket

load_environment_variables()

app = Flask("lhacks-portal")

socket.socketio = SocketIO(app, cors_allowed_origins="*")

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)

CORS(app, resources={r"/socket.io/*": {"origins": "*"}})

app.secret_key = env.get("APP_SECRET_KEY")
oauth.oauth = OAuth(app)
oauth.oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration',
)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(scan_bp, url_prefix="/scan")
app.register_blueprint(meal_bp, url_prefix="/meal")

@socket.socketio.on("connect")
def connected():
    print("Client connected")

@socket.socketio.on("disconnect")
def disconnected():
    socketSessionManager.DestroySession(request.sid)
    print("Sessions: ", socketSessionManager.Sessions)


@socket.socketio.on("register")
def register(data: str):
    print("register: ", data)

    session: SocketSession | None = socketSessionManager.GetSessionByUser(data)

    if session:
        session.Emit("response", json.dumps({"error": "User already registered."}))

    session = socketSessionManager.CreateSession(request.sid, data)
    session.Emit("response", json.dumps(session.ToDict()))

    print("session: ", socketSessionManager.Sessions)


if __name__ == "__main__":
    socket.socketio.run(
        app,
        host="0.0.0.0",
        port=int(env.get("PORT", 3000)),
        ssl_context=("cert.pem", "key.pem"),
        debug=True,
    )
