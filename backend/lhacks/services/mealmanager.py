import uuid
import time

from lhacks.schema.meal import Meal, MealType 
from sqlalchemy.orm import Session

class MealManager:
    def __init__(self, db: Session):
        self.DB = db 

    def AddMeal(self, meal: Meal) -> Meal:
        self.DB.add(meal)
        self.DB.commit()

        return meal

    def CreateMeal(self, userID: str, type: MealType) -> Meal:
        return Meal(ID=str(uuid.uuid4()), UserID=userID, Type=int(type), CreatedAt=time.time())

    def GetMealsByUserID(self, userID: str) -> list[Meal]:
        return self.DB.query(Meal).where(id=userID)
