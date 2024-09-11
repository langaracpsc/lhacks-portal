"use client";
import { create } from "zustand";

export interface User {
  ID: string;
  QRCode: string;
  Email: string;
  CreatedAt: number;
  FullName: string;
  PreferredName: string;
  DietaryRestriction: string;
  Allergies: string | null;
  Role: number;
}

export interface CheckInInfo {
  CheckedIn: boolean;
  Time: number;
}

export const useAuthStore = create((set) => ({
  User: {
    Checkin: {} as CheckInInfo,
  },

  Token: null,

  SetToken: (token: string) => set({ Token: token }),
  SetUser: (user: User) => set({ User: user }),
  CheckIn: (user: User, checkinInfo: CheckInInfo) =>
    set({
      User: {
        ...user,
        CheckinInfo: checkinInfo,
      },
    }),
}));

if (typeof window !== "undefined") {
  useAuthStore.subscribe((state) => {
    window.localStorage.setItem("authStore", JSON.stringify(state));
  });

  const savedState = JSON.parse(
    window.localStorage.getItem("authStore") || "{}",
  );
  useAuthStore.setState(savedState);
}
