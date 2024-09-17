"use client";
import { useEffect, useReducer, useRef } from "react";
import Header from "../header";
import { useAuthStore, User } from "../Store/AuthStore";
import Ticket from "../ticket";
import useSocketService from "../hooks/useSocketService";
import { fetchCheckinInfo } from "../user/service";

export default function CheckInPage() {
  const { User, Token } = useAuthStore((state: any) => ({
    User: state.User,
    Token: state.Token,
  }));

  const Registered = useRef<boolean>(false);

  const CheckIn = useAuthStore((state: any) => state.CheckIn);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { Socket } = useSocketService({
    URL: process.env.API_URL as string,

    OnResponse: (data: string) => {
      const response = JSON.parse(data);

      console.log("Response CheckedIn: ", response);

      if (response?.scan && User && Token) {
        fetchCheckinInfo(User, Token).then((checkinResponse: any) => {
          CheckIn(User, {
            CheckedIn: checkinResponse.checked_in,
            Time: checkinResponse?.scan?.created_at,
          });

          forceUpdate();
        });
      } else if (response?.UserID) {
        console.log("User registered in CheckIn");
        Registered.current = true;
      }
    },
  });

  if (!Registered.current) Socket.emit("register", User.ID);

  console.log(`Socket session in Checkin: ${Socket.id}`);
  const checkedIn = useRef<boolean>(false);

  if (User?.CheckinInfo?.CheckedIn !== undefined)
    checkedIn.current = User?.CheckinInfo?.CheckedIn;

  console.log("checkedin: ", checkedIn.current);

  const nameSplit = User.FullName?.split(" ");

  console.log({
    User,
    Token,
  });

  return (
    <>
      <div className=" flex flex-col w-screen h-full  items-center bg-black gap-16">
        <div className="w-screen h-fit flex justify-end items-start">
          <Header />
        </div>
        {User.ID !== undefined && checkedIn.current !== undefined ? (
          <Ticket
            QRCode={User?.ID}
            Name={nameSplit?.[0]}
            FName={nameSplit?.[1]}
            Status={checkedIn.current}
            CheckInTime={new Date(
              User?.CheckinInfo?.Time * 1000,
            ).toDateString()}
          />
        ) : (
          <> Loading </>
        )}
      </div>
    </>
  );
}
