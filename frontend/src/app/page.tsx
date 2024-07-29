"use client";
import React from 'react';
import { useQRCode } from 'next-qrcode';
import Food from './food';
import Schedule from './schedule';
import Ticket from './ticket';
import Participant from './LogIn/participant';
import Choice from './LogIn/choice';



export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center  w-screen bg-black">
      

      
      <Choice/>
    </main>
  );
}