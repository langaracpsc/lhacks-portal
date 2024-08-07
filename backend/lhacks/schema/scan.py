from lhacks.schema.base import Base
from sqlalchemy import Column, String, Integer

from enum import Enum

class ScanType(Enum):
    CheckIn = 0
    Meal = 1

class Scan(Base):
    __tablename__ = "scans"

    ID = Column(String(36), name="id", primary_key=True, nullable=False)
    UserID = Column(String(256), name="user_id",  nullable=False)
    CreatedAt = Column(Integer(), name="createdat",  nullable=False)
    Type = Column(Integer(), name="type", nullable=False)

    def ToDict(self) -> dict:
        return {
            "id": self.ID,
            "user_id": self.UserID,
            "created_at": self.CreatedAt,
            "type": self.Type
        }

    def __repr__(self):
        return (
            f"<Scan(id='{self.ID}', user_id='{self.UserID}', "
            f"created_at='{self.CreatedAt}', type='{self.Type}')>"
        )
    
