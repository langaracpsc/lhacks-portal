"use client";
import { useEffect, useRef } from "react";
import Header from "../header";
import { useAuthStore, User } from "../Store/AuthStore";
import Ticket from "../ticket";

export default function CheckInPage() {
  const { User, Token } = useAuthStore((state: any) => ({
    User: state.User,
    Token: state.Token,
  }));

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
