"use client";
import React, { useEffect } from "react";
import { useQRCode } from "next-qrcode";
import Food from "./food";
import Schedule from "./schedule";
import Ticket from "./ticket";
import Participant from "./LogIn/participant";
import Choice from "./LogIn/choice";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./Store/AuthStore";

export default function Home() {
  const router = useRouter();

  const { Token } = useAuthStore((state: any) => ({
    Token: state.Token,
  }));

  try {
    if (!Token) router.push(`https://${process.env.API_URL}/auth/login`);
    else router.push("/CheckinPage");
  } catch (e) {
    console.log(e);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center  w-screen bg-black text-white">
      Redirecting
    </main>
  );
}
