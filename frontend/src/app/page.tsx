"use client";
import React from 'react';
import { useQRCode } from 'next-qrcode';
import Food from './food';
import Schedule from './schedule';
import Ticket from './ticket';
import Participant from './LogIn/participant';
import Choice from './LogIn/choice';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  router.push(`http://127.0.0.1:5000/auth/login`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center  w-screen bg-black">
      <Choice/>
    </main>
  );
}