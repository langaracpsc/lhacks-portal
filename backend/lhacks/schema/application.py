from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import declarative_base
from lhacks.schema.base import Base

class Application(Base):
    __tablename__ = "applications"
    
    ID = Column(String(36), name="id", primary_key=True)
    Email = Column(String(256), name="email", unique=True)
    CreatedAt = Column(Integer, name="createdat")
    FullName = Column(String(256), name="full_name")
    PreferredName = Column(String(256), name="preferred_name")
    DietaryRestriction = Column(String(256), name="dietary_restriction")
    Allergies = Column(String(256), name="allergies", nullable=True)

    def ToDict(self) -> dict:
        return {
            "ID": self.ID,
            "Role": self.Role, 
            "Email": self.Email,
            "FullName": self.FullName,
            "PreferredName": self.PreferredName,
            "DietaryRestriction": self.DietaryRestriction,
        }
    
    def __repr__(self):
        return (
            f"<User(id='{self.ID}', email='{self.Email}', created_at='{self.CreatedAt}', "
            f"full_name='{self.FullName}', "
            f"preferred_name='{self.PreferredName}', dietary_restriction='{self.DietaryRestriction}', "
            f"allergies='{self.Allergies}')>"
        )
        
