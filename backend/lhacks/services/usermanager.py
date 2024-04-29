import uuid
import time

from lhacks.schema.usermodel import UserModel
from lhacks.models.user import User

from sqlalchemy.orm import Session
from sqlalchemy.engine import Engine

class UserManager:
    def __init__(self, db: Session):
        self.DB = db 
        return

    def CreateUser(self, email: str):
        return User(str(uuid.uuid4()), email, time.time())
    
    def AddUser(self, user: User):
        try:
            self.DB.add(UserModel(id=user.ID, email=user.Email, createdAt=user.CreatedAt))

        except Exception as e:
            print("Failed to add the user:", e)

            raise 

        return True

        