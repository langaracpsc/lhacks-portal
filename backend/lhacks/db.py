from os import environ as env

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from lhacks.config import load_environment_variables, CONNECTION_STRING

load_environment_variables()

print(CONNECTION_STRING)

engine = create_engine(CONNECTION_STRING, echo=True)

dbSession = Session(engine)

