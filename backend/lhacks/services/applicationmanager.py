import uuid
import time

from lhacks.schema.application import Application
from sqlalchemy.orm import Session

class ApplicationManager:
    def __init__(self, db: Session):
        self.DB = db 

    def AddApplication(self, application: Application) -> Application | None:
        try:
            self.DB.add(application)
            self.DB.commit()

        except:
            return None
        
        return application 

    def GetApplicationByEmail(self, email: str) -> Application:
        return self.DB.query(Application).where(email=email)