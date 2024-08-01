"use client"
import React, { useState, useEffect } from 'react';

interface Event {
  time: string;
  title: string;
  date: string;
}

interface ScheduleProps {
  events: Event[];
}

// need to set up emphasizing of the current event/check what event is current

export default function Schedule({ events }: ScheduleProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen text-white rounded-lg gap-5">
      <div className="flex flex-col text-center gap-3">
        <p className="text-4xl font-bold text-orange-500">Hackathon Timer</p>
        <p className="text-6xl font-bold">{formatTime(time)}</p>
      </div>
      <div id="croll" className="max-h-[60vh] w-11/12 p-5  scrollbar-thumb-orange-700 overflow-y-auto">
        {events.map((event, index) => (
          <div key={index} className={`p-4  rounded-lg mb-2 ${index === 1 ? 'bg-orange-950' : 'bg-zinc-800'}`}>
            <div className="flex flex-row justify-between items-center">
              <p>{event.title}</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className='text-orange-500'>{event.date}</p>
              <p className='text-orange-500'>{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}