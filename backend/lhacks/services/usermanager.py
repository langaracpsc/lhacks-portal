import uuid
import time
import sys
import os

import lhacks.util.crypto as crypto

from lhacks.schema.application import Application
from lhacks.services.applicationmanager import ApplicationManager

from lhacks.schema.user import User

from sqlalchemy.orm import Session
from sqlalchemy import update

from enum import Enum

class Role(Enum):
    Admin=0
    Exec=1
    User=2

class UserManager:
    def __init__(self, db: Session):
        self.DB = db
        self.ApplicationManager = ApplicationManager(db)

    def CreateUser(self, email: str, full_name: str, preferred_name: str = None, dietary_restriction: str = None, allergies: str = None, role: Role = Role.User) -> User:
        id: str = crypto.GetSha256Hash(email)

        return User(
            ID=id,
            Email=email,
            QRCode=id,
            FullName=full_name,
            PreferredName=preferred_name,
            DietaryRestriction=dietary_restriction,
            Allergies=allergies,
            CreatedAt=int(time.time()),
            Role=role
        )

    def GetUserByEmail(self, email: str) -> User | None:
        return self.DB.query(User).filter_by(Email=email).first()

    def GetUsers(self) -> list[dict]:
        return [user.ToDict() for user in self.DB.query(User).all()]

    def AddUser(self, user: User) -> User | None:
        try:
            self.DB.add(user)
            self.DB.commit()
        except Exception as e:
            print("Failed to add the user:", e)
            self.DB.rollback()
            raise
        return user
    
    def GetUserInfo(self, user_id: str) -> dict:
        user = self.DB.query(User).filter_by(ID=user_id).first()
        if not user:
            return {"error": "User not found"}
        
        return user
    
    def SyncUserWithApplication(self, email: str) -> User:
        application: Application = self.ApplicationManager.GetApplicationByEmail(email)

        if (not application):
            return {"error": "Application not found"}

        user: User = None 

        try:
            update(User).where(User.Email == email).values(
                PreferredName=application.PreferredName, 
                DietaryRestriction=application.DietaryRestriction, 
                Allergies=application.Allergies
            )

            user = self.GetUserByEmail(email).ToDict()

        except Exception as e: 
            return {"error": e.args[1]}
        
        return user

