from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import DeclarativeBase
from lhacks.schema.base import Base

class User(Base):
    __tablename__ = "users"
    ID = Column(String(36), name="id", primary_key=True)
    Email = Column(String(256), name="email", unique=True)
    CreatedAt = Column(Integer, name="createdat")    

    def __repr__(self):
            return "<User(name='%s', email='%s', createdAt='%d')>" % (
                self.ID,
                self.Email,
                self.CreatedAt
            )