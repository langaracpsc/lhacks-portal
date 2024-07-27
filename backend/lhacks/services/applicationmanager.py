import uuid
import time

from lhacks.schema.application import Application
from sqlalchemy.orm import Session

class ApplicationManager:
    def __init__(self, db: Session):
        self.DB = db 

    def AddApplication(application: Application) -> bool:
        return False
    
    def GetApplicationByEmail(email: str) -> dict:
        return {}