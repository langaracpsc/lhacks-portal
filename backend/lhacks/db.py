from os import environ as env

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

engine = create_engine(env.get("CONNECTION_STRING"), echo=True)

dbSession = Session(engine)

