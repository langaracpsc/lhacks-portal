from sqlalchemy import Column, String, Integer
from lhacks.schema.base import Base

class UserModel(Base):
    __table__ = "users"
    id = Column(String(36), primary_key=True)
    email = Column(String(256), primary_key=True)
    createdAt = Column(Integer)    

    def __repr__(self):
            return "<User(name='%s', email='%s', createdAt='%d')>" % (
                self.id,
                self.email,
                self.createdAt
            )