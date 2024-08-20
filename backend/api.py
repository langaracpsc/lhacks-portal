import lhacks.oauth as oauth  
from os import environ as env
from authlib.integrations.flask_client import OAuth
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from lhacks.blueprints.auth import auth_bp
from lhacks.blueprints.user import user_bp
from lhacks.blueprints.scan import scan_bp
from lhacks.blueprints.meal import meal_bp
from lhacks.config import load_environment_variables
from OpenSSL import SSL

load_environment_variables()

app = Flask("lhacks-portal")

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
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)   

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/user") 
app.register_blueprint(scan_bp, url_prefix="/scan") 
app.register_blueprint(meal_bp, url_prefix="/meal") 

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def connected():
    print('Client connected')

@socketio.on('disconnect')
def disconnected():
    print('Client disconnected')

if __name__ == "__main__":
    context = SSL.Context(SSL.TLSv1_2_METHOD)
    
    context.use_certificate_file('certificate.pem')
    context.use_privatekey_file('private_key.pem')
    
    socketio.run(app, host="0.0.0.0", port=int(env.get("PORT", 3000)), ssl_context=context, debug=True)