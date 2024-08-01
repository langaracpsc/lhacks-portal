import uuid
import time

from lhacks.schema.meal import Meal, MealType, MealToken 
from sqlalchemy.orm import Session

class MealManager:
    def __init__(self, db: Session):
        self.DB = db 

    def AddMeal(self, meal: Meal) -> Meal:
        self.DB.add(meal)
        self.DB.commit()

        return meal
    
    def ActivateMeal(self, meal: str) -> dict:
        if (self.GetActiveMeal() != None):
            return {"error": "Another meal is already active"}

        meal: Meal = self.DB.query(Meal).filter_by(Name=meal).first()

        if (meal == None):
            return {"error": "Meal doesnt exist"}

        meal.Active = True
        self.DB.commit()

        return meal.ToDict()

    def DeactivateMeal(self, meal: str) -> dict:
        meal: Meal = self.DB.query(Meal).filter_by(Name=meal).first()

        if (meal == None):
            return {"error": "Meal doesnt exist"}

        meal.Active = False
        self.DB.commit()

        return meal.ToDict()

    def GetMeals(self) -> list[dict]:
        return [meal.ToDict() for meal in self.DB.query(Meal).all()]

    def GetActiveMeal(self) -> dict:
        meal = self.DB.query(Meal).filter_by(Active=True).first()
        return meal if meal == None else meal.ToDict()
        
    def CreateMealToken(self, userId: str, mealID: str) -> MealToken:
        currentTime: int = time.time()
        return MealToken(ID=str(uuid.uuid4()), UserID=userId, MealID=mealID, Used=False, UpdatedAt=currentTime, CreatedAt=currentTime)
        
    def AddMealToken(self, token: MealToken) -> MealToken:
        self.DB.add(token)
        self.DB.commit()

        return token
    
    def SpendToken(self, userID: str, mealName: str) -> dict:
        meal: Meal | None = self.DB.query(Meal).filter_by(Name=mealName).first()

        if (meal == None):
            return { "error": f"Meal {meal} not found." }

        token: MealToken | None = self.DB.query(MealToken).filter_by(UserID=userID, MealID=meal.ID, Used=False).first()

        if (token == None):
            return { "error": "Not enough tokens." }

        token.Used = True

        self.DB.commit()

        return token.ToDict() 

    def CreateMeal(self, userID: str, type: MealType) -> Meal:
        return Meal(ID=str(uuid.uuid4()), UserID=userID, Type=int(type), CreatedAt=time.time())

    def GetMealsByUserID(self, userID: str) -> list[Meal]:
        return self.DB.query(Meal).where(id=userID)
