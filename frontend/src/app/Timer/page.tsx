"use client";

import { useEffect, useInsertionEffect, useRef, useState } from "react";
import Header from "../header";
import Schedule from "../schedule";
import { useAuthStore } from "../Store/AuthStore";
import { useRouter } from "next/navigation";
import { Circles } from "react-loading-icons";

const events = [
  { time: "7:30", title: "Check-in + Breakfast", date: "September 21" },
  { time: "8:30", title: "Opening Ceremony", date: "September 21" },
  { time: "9:00", title: "Coding Time", date: "September 21" },
  { time: "11:30", title: "Minigame 1", date: "September 21" },
  { time: "12:00", title: "Lunch", date: "September 21" },
  { time: "13:00", title: "Coding Time", date: "September 21" },
  { time: "14:00", title: "Minigame 2", date: "September 21" },
  { time: "15:30", title: "Minigame 3", date: "September 21" },
  { time: "16:00", title: "Dinner", date: "September 21" },
  { time: "17:00", title: "Minigame 4", date: "September 21" },
  { time: "7:30", title: "Check-in + Breakfast", date: "September 22" },
  { time: "8:00", title: "Coding Time", date: "September 22" },
  { time: "10:00", title: "Minigame 5", date: "September 22" },
  { time: "12:00", title: "Lunch", date: "September 22" },
  { time: "13:00", title: "Coding Time", date: "September 22" },
  { time: "14:00", title: "Judging + Presentations", date: "September 22" },
  { time: "16:00", title: "Deploying with Defang", date: "September 22" },
  { time: "17:00", title: "Closing Ceremony", date: "September 22" },
];

export default function TimerPage() {
  const { User, Token } = useAuthStore((state: any) => ({
    User: state.User,
    Token: state.Token,
  }));

  const router = useRouter();

  const checkedIn = useRef<boolean>(false);

  if (User?.CheckinInfo?.CheckedIn !== undefined)
    checkedIn.current = User?.CheckinInfo?.CheckedIn;

  console.log("timer checked in: ", checkedIn);

  try {
    if (!checkedIn.current) router.push("/CheckinPage");
  } catch (e) {
    console.log(e);
  }

  return (
    <>
      {checkedIn.current ? (
        <div className="  flex flex-col w-screen h-screen">
          <div className="w-screen h-screen  flex justify-end items-start  ">
            <Header />
          </div>

          <Schedule events={events} />
        </div>
      ) : (
        <div className="w-screen h-screen flex  justify-center items-center gap-32">
          <Circles />
        </div>
      )}
    </>
  );
}
