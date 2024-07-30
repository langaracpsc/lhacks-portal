from lhacks.schema.base import Base
from sqlalchemy import Column, String, Integer, Boolean

from enum import Enum

class MealType(Enum):
    Breakfast = 0
    Lunch = 1
    Dinner = 2
    Snacks = 3

class Meal(Base):
    __tablename__ = "meals"

    ID = Column(String(36), name="id", primary_key=True, nullable=False)
    Name = Column(String(64), name="name", unique=True, nullable=False)
    CreatedAt = Column(Integer(), name="created_at",  nullable=False)
    UpdatedAt = Column(Integer(), name="updated_at", nullable=False) 
    Active = Column(Boolean(), name="active", nullable=False)
    Type = Column(Integer(), name="type", nullable=False)

    def ToDict(self) -> dict:
        return {
            "id": self.ID,
            "name": self.Name,
            "created_at": self.CreatedAt,
            "updated_at": self.UpdatedAt,
            "active": self.Active,
            "type": self.Type
        }

    def __repr__(self):
        return (
            f"<Meal(id='{self.ID}', name='{self.Name}', "
            f"created_at='{self.CreatedAt}', updated_at='{self.UpdatedAt}', active='{self.Active}', type='{self.Type}')>"
        )
    

class MealToken(Base):
    __tablename__ = "meal_tokens"
    ID = Column(String(36), name="id", primary_key=True, nullable=False)
    UserID = Column(String(36), name="user_id", nullable=False)  # New field
    MealID = Column(String(36), name="meal_id", nullable=False)
    Used = Column(Boolean(), name="used", nullable=False, default=False)
    UpdatedAt = Column(Integer(), name="updated_at", nullable=False)
    CreatedAt = Column(Integer(), name="created_at", nullable=False)

    def ToDict(self) -> dict:
        return {
            "id": self.ID,
            "user_id": self.UserID,  # Added UserID
            "meal_id": self.MealID,
            "used": self.Used,
            "updated_at": self.UpdatedAt,
            "created_at": self.CreatedAt
        }

    def __repr__(self):
        return (
            f"<MealToken(id='{self.ID}', user_id='{self.UserID}', "  # Added UserID
            f"meal_id='{self.MealID}', used='{self.Used}', "
            f"updated_at='{self.UpdatedAt}', created_at='{self.CreatedAt}')>"
        )