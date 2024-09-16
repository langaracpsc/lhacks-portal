import { useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocketService({
  URL,
  OnResponse,
}: {
  URL: string;
  OnResponse: (data: string) => void;
}): {
  Socket: Socket;
  Connected: boolean;
} {
  const socket = useMemo(
    () =>
      io(URL, {
        transports: ["websocket"],
      }),
    [io, URL],
  );

  const Connected = useRef<boolean>(false);

  socket.on("connect", () => {
    console.log("SocketIO connected");
    Connected.current = true;
  });

  socket.on("disconnect", () => {
    Connected.current = false;
  });

  socket.on("connect_error", (error) => {
    console.log("Connection error: ", error.toString());
  });

  socket.on("response", OnResponse);

  return {
    Socket: socket,
    Connected: Connected.current,
  };
}
