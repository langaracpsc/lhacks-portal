import os
from dotenv import load_dotenv, find_dotenv

def load_environment_variables():
    ENV_FILE = find_dotenv()
    if ENV_FILE:
        load_dotenv(ENV_FILE)

load_environment_variables()

AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_API_IDENTIFIER = os.getenv('AUTH0_API_IDENTIFIER')
ALGORITHMS = ["RS256"]