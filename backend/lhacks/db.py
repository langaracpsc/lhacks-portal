from os import environ as env

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from lhacks.config import load_environment_variables

load_environment_variables()

engine = create_engine(env.get("CONNECTION_STRING"), echo=True)

dbSession = Session(engine)

