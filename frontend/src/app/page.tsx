"use client";
import React, { useEffect } from 'react';
import { useQRCode } from 'next-qrcode';
import Food from './food';
import Schedule from './schedule';
import Ticket from './ticket';
import Participant from './LogIn/participant';
import Choice from './LogIn/choice';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(`https://${process.env.API_URL}/auth/login`);
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center  w-screen bg-black text-white">
      Redirecting
    </main>
  );
}