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

    def GetScans(self, userId: str, type: int) -> list[dict]:
        scans = None

        try:
            scans = self.DB.query(Scan).filter_by(UserID=userId, Type=type).all()
        except Exception as e:
            print("Error: ", e.args[0])
            self.DB.rollback()

        return [] if scans == None else [scan.ToDict() for scan in scans]

    def CreateScan(self, userID: str, type: ScanType) -> Scan:
        return Scan(ID=str(uuid.uuid4()), UserID=userID, Type=int(type), CreatedAt=time.time())

    def GetScansByUserID(self, userID: str) -> list[Scan]:
        return self.DB.query(Scan).where(id=userID)
