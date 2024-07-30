import lhacks.oauth as oauth  

from os import environ as env
from authlib.integrations.flask_client import OAuth
from flask import Flask

from lhacks.blueprints.auth import auth_bp
from lhacks.blueprints.user import user_bp
from lhacks.blueprints.scan import scan_bp
from lhacks.blueprints.meal import meal_bp

from lhacks.config import load_environment_variables

def create_app():
    load_environment_variables()
    
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
    app.register_blueprint(user_bp, url_prefix="/user") 
    app.register_blueprint(scan_bp, url_prefix="/scan") 
    app.register_blueprint(meal_bp, url_prefix="/meal") 

    return app


if __name__ == "__main__":
    app = create_app()
    
    app.run(host="0.0.0.0", port=env.get("PORT", 3000))