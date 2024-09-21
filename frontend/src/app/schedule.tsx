"use client";
import React, { useState, useEffect } from "react";

interface Event {
  from: Date;
  to: Date;
  title: string;
}

const eventSchedule: Event[] = [
  // September 21, 2024
  {
    from: new Date("2024-09-21T07:30:00-07:00"),
    to: new Date("2024-09-21T08:30:00-07:00"),
    title: "Check-in + Breakfast",
  },
  {
    from: new Date("2024-09-21T08:30:00-07:00"),
    to: new Date("2024-09-21T09:00:00-07:00"),
    title: "Opening Ceremony",
  },
  {
    from: new Date("2024-09-21T09:00:00-07:00"),
    to: new Date("2024-09-21T12:00:00-07:00"),
    title: "Coding Time",
  },
  {
    from: new Date("2024-09-21T11:30:00-07:00"),
    to: new Date("2024-09-21T12:00:00-07:00"),
    title: "Mini Game 1",
  },
  {
    from: new Date("2024-09-21T12:00:00-07:00"),
    to: new Date("2024-09-21T13:00:00-07:00"),
    title: "Lunch",
  },
  {
    from: new Date("2024-09-21T13:00:00-07:00"),
    to: new Date("2024-09-21T18:00:00-07:00"),
    title: "Coding Time",
  },
  {
    from: new Date("2024-09-21T14:00:00-07:00"),
    to: new Date("2024-09-21T14:30:00-07:00"),
    title: "Mini Game 2",
  },
  {
    from: new Date("2024-09-21T15:30:00-07:00"),
    to: new Date("2024-09-21T16:00:00-07:00"),
    title: "Mini Game 3",
  },
  {
    from: new Date("2024-09-21T16:00:00-07:00"),
    to: new Date("2024-09-21T17:00:00-07:00"),
    title: "Dinner",
  },
  {
    from: new Date("2024-09-21T17:00:00-07:00"),
    to: new Date("2024-09-21T17:30:00-07:00"),
    title: "Mini Game 4",
  },
  // September 22, 2024
  {
    from: new Date("2024-09-22T07:30:00-07:00"),
    to: new Date("2024-09-22T08:00:00-07:00"),
    title: "Check-in + Breakfast",
  },
  {
    from: new Date("2024-09-22T08:00:00-07:00"),
    to: new Date("2024-09-22T13:00:00-07:00"),
    title: "Coding Time",
  },
  {
    from: new Date("2024-09-22T10:00:00-07:00"),
    to: new Date("2024-09-22T10:30:00-07:00"),
    title: "Mini Game 5",
  },
  {
    from: new Date("2024-09-22T13:00:00-07:00"),
    to: new Date("2024-09-22T14:00:00-07:00"),
    title: "Lunch",
  },
  {
    from: new Date("2024-09-22T14:00:00-07:00"),
    to: new Date("2024-09-22T15:00:00-07:00"),
    title: "Deploying with Defang",
  },
  {
    from: new Date("2024-09-22T15:00:00-07:00"),
    to: new Date("2024-09-22T17:00:00-07:00"),
    title: "Judging + Presentations",
  },
  {
    from: new Date("2024-09-22T17:00:00-07:00"),
    to: new Date("2024-09-22T18:00:00-07:00"),
    title: "Closing Ceremony",
  },
];

const judgingEvent = eventSchedule.find((event) =>
  event.title.includes("Judging"),
);

export default function Schedule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeToJudging, setTimeToJudging] = useState<string>("");
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const current = eventSchedule.find(
        (event) => now >= event.from && now < event.to,
      );
      setCurrentEvent(current || null);

      if (judgingEvent && now < judgingEvent.from) {
        const timeDiff = judgingEvent.from.getTime() - now.getTime();
        setTimeToJudging(formatTime(timeDiff));
      } else {
        setTimeToJudging("Judging has started");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen text-white rounded-lg gap-5">
      <div className="flex flex-col text-center gap-3">
        <p className="text-4xl font-bold text-orange-500">Hackathon Timer</p>
        <p className="text-6xl font-bold">{timeToJudging}</p>
      </div>
      <div
        id="scroll"
        className="max-h-[60vh] w-11/12 p-5 scrollbar-thumb-orange-700 overflow-y-auto"
      >
        {currentEvent && (
          <div className="p-4 rounded-lg mb-2 bg-orange-950">
            <div className="flex flex-row justify-between items-center">
              <p>{currentEvent.title}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-orange-500">
                {formatEventDate(currentEvent.from)}
              </p>
              <p className="text-orange-500">
                {formatEventTime(currentEvent.from)} -{" "}
                {formatEventTime(currentEvent.to)}
              </p>
            </div>
          </div>
        )}
        {eventSchedule.map((event, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg mb-2 ${event === currentEvent ? "bg-orange-950" : "bg-zinc-800"}`}
          >
            <div className="flex flex-row justify-between items-center">
              <p>{event.title}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-orange-500">{formatEventDate(event.from)}</p>
              <p className="text-orange-500">
                {formatEventTime(event.from)} - {formatEventTime(event.to)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
