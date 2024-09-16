from typing import Callable
from typing_extensions import Any

from flask_socketio import emit, join_room, leave_room
import lhacks.sockets.globals as socket


class SocketSession:
    def __init__(self, id: str, userID: str):
        self.ID: str = id
        self.UserID: str = userID

    def ToDict(self) -> dict:
        return {"id": self.ID, "userId": self.UserID}

    def Emit(self, event: str, data: Any):
        socket.socketio.emit(event, data, to=self.ID)


class SocketSessionManager:
    def CreateSession(self, id: str, userID: str) -> SocketSession:
        join_room(id)

        session = SocketSession(id, userID)

        self.Sessions[id] = session

        return session

    def DestroySession(self, id: str) -> SocketSession:
        leave_room(self.Sessions[id].ID)

        return self.Sessions.pop(id)

    def GetSessionByUser(self, id: str):
        for key in self.Sessions:
            session: SocketSession = self.Sessions[key]
            if session.UserID == id:
                return session

        return None

    def __init__(self):
        self.Sessions: dict = {}


socketSessionManager = SocketSessionManager()
