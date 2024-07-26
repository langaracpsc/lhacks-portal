"use client";
import React from 'react';
import { useQRCode } from 'next-qrcode';
import Food from './food';
import Schedule from './schedule';
import Ticket from './ticket';
import Participant from './LogIn/participant';
import Choice from './LogIn/choice';

const events = [
  { time: '6:00', title: 'Hackathon Begins', date: 'September 21' },
  { time: '10:30', title: 'Mini event 1', date: 'September 21' },
  { time: '18:30', title: 'End of the day', date: 'September 21' },
  { time: '9:00', title: 'The Beginning of next day', date: 'September 21' },
  { time: '10:30', title: 'Mini event 1', date: 'September 22' },
  { time: '18:30', title: 'End of the day', date: 'September 22' },
  { time: '9:00', title: 'The Beginning of next day', date: 'September 22' }
];

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center g-12">
      {/* <Schedule events={events} /> */}
      {/* <Food QRCode="Hello How are u doing?" mealToken={2} tokenType='breakfast'></Food> */}
      {/* <Ticket QRCode='qgwqfkecywquegckyuwegcqwyuegcwer' Name='Serhii' FName='Ambartsumian' Status={true} CheckInTime='25-08-2004 14:30'></Ticket> */}
      {/* <Participant QRCode='hqwegfkyqwgfyqwe'></Participant> */}
      <Choice></Choice>
    </main>
  );
}