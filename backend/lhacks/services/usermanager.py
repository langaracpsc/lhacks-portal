import uuid
import time

from lhacks.schema.user import User

from sqlalchemy.orm import Session
from sqlalchemy.engine import Engine

class UserManager:
    def __init__(self, db: Session):
        self.DB = db 

    def CreateUser(self, email: str):
        return User(ID=str(uuid.uuid4()), Email=email, CreatedAt=time.time())
    
    def AddUser(self, user: User) -> bool:
        try:
            self.DB.add(User(ID=user.ID, Email=user.Email, CreatedAt=user.CreatedAt))
            self.DB.commit()

        except Exception as e:
            print("Failed to add the user:", e)
 
            raise 

        return True
