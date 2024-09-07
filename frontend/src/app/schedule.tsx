"use client";
import React, { useState, useEffect } from "react";

interface Event {
  time: string;
  title: string;
  date: string;
}

interface ScheduleProps {
  events: Event[];
}

const myDate = new Date();
myDate.setFullYear(2000, 4, 15);

const eventDates: Array<Date> = [
  new Date("2024-09-21T07:30:00-07:00"), // Check-in + Breakfast
  new Date("2024-09-21T08:30:00-07:00"), // Opening Ceremony
  new Date("2024-09-21T09:00:00-07:00"), // Coding Time
  new Date("2024-09-21T11:30:00-07:00"), // Minigame 1
  new Date("2024-09-21T12:00:00-07:00"), // Lunch
  new Date("2024-09-21T13:00:00-07:00"), // Coding Time
  new Date("2024-09-21T14:00:00-07:00"), // Minigame 2
  new Date("2024-09-21T15:30:00-07:00"), // Minigame 3
  new Date("2024-09-21T16:00:00-07:00"), // Dinner
  new Date("2024-09-21T17:00:00-07:00"), // Minigame 4
  new Date("2024-09-22T07:30:00-07:00"), // Check-in + Breakfast
  new Date("2024-09-22T08:00:00-07:00"), // Coding Time
  new Date("2024-09-22T10:00:00-07:00"), // Minigame 5
  new Date("2024-09-22T12:00:00-07:00"), // Lunch
  new Date("2024-09-22T13:00:00-07:00"), // Coding Time
  new Date("2024-09-22T14:00:00-07:00"), // Judging + Presentations
  new Date("2024-09-22T16:00:00-07:00"), // Deploying with Defang
  new Date("2024-09-22T17:00:00-07:00"),
];
let currentDate = new Date();
let holdTime: string = "";
var display = "";

// need to set up emphasizing of the current event/check what event is current

export default function Schedule({ events }: ScheduleProps) {
  const [time, setTime] = useState<string>();

  useEffect(() => {
    for (let i = 0; i < eventDates.length; i++) {
      if (currentDate <= eventDates[i]) {
        var eventDate = eventDates[i];
        break;
      }
    }

    setInterval(() => {
      currentDate = new Date();
      var dateToUse = eventDate.getTime() - currentDate.getTime();

      holdTime = formatTime(dateToUse);
      setTime(holdTime);
    }, 1000);
  }, []);

  const formatTime = (date: number) => {
    const hours = String(Math.floor(date / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((date % 3600000) / 60000)).padStart(
      2,
      "0",
    );
    const seconds = String(Math.floor((date % 60000) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen text-white rounded-lg gap-5">
      <div className="flex flex-col text-center gap-3">
        <p className="text-4xl font-bold text-orange-500">Hackathon Timer</p>
        <p className="text-6xl font-bold">{time}</p>
      </div>
      <div
        id="croll"
        className="max-h-[60vh] w-11/12 p-5  scrollbar-thumb-orange-700 overflow-y-auto"
      >
        {events.map((event, index) => (
          <div
            key={index}
            className={`p-4  rounded-lg mb-2 ${index === 1 ? "bg-orange-950" : "bg-zinc-800"}`}
          >
            <div className="flex flex-row justify-between items-center">
              <p>{event.title}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-orange-500">{event.date}</p>
              <p className="text-orange-500">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
