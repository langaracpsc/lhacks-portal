import uuid
import time

from lhacks.schema.scan import Scan, ScanType 
from sqlalchemy.orm import Session

class ScanManager:
    def __init__(self, db: Session):
        self.DB = db 

    def AddScan(self, scan: Scan) -> Scan:
        self.DB.add(scan)
        self.DB.commit()

        return scan

    def CreateScan(self, userID: str, type: ScanType) -> Scan:
        return Scan(ID=str(uuid.uuid4()), UserID=userID, Type=int(type), CreatedAt=time.time())

    def GetScansByUserID(self, userID: str) -> list[Scan]:
        return self.DB.query(Scan).where(id=userID)
