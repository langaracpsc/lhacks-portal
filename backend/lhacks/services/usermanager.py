import uuid
import time

from lhacks.schema.user import User
from sqlalchemy.orm import Session

class UserManager:
    def __init__(self, db: Session):
        self.DB = db 

    def CreateUser(self, id: str, email: str, full_name: str, preferred_name: str = None, dietary_restriction: str = None, allergies: str = None) -> User:
        return User(
            ID=id,
            Email=email,
            QRCode=str(uuid.uuid4()),
            FullName=full_name,
            PreferredName=preferred_name,
            DietaryRestriction=dietary_restriction,
            Allergies=allergies,
            CreatedAt=int(time.time())
        )
    
    def AddUser(self, user: User) -> bool:
        try:
            self.DB.add(user)
            self.DB.commit()
        except Exception as e:
            print("Failed to add the user:", e)
            self.DB.rollback()
            raise
        return True
    
    def GetUserInfo(self, user_id: str) -> dict:
        user = self.DB.query(User).filter_by(ID=user_id).first()
        if not user:
            return {"error": "User not found"}
        
        return user.ToDict()