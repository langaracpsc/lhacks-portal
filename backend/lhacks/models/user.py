import json

class User:
    def __init__(self, id: str, email: str, createdAt: str):
        self.ID: str = id
        self.Email: str = email
        self.CreatedAt: str = createdAt
    
    def ToJson(self):
        return json.dumps(self)