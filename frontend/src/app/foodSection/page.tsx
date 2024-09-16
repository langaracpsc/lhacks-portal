"use client";

import { useEffect, useRef, useState } from "react";
import Food from "../food";
import Header from "../header";
import { useAuthStore } from "../Store/AuthStore";
import { waitForDebugger } from "inspector";
import { setDefaultAutoSelectFamily } from "net";
import { useRouter } from "next/navigation";
import LoadingIcons, { Circles } from "react-loading-icons";
import useSocketService from "../hooks/useSocketService";

interface MealToken {
  ID: string;
  UserID: string;
  MealID: string;
  Used: boolean;
  UpdatedAt: number;
  CreatedAt: number;
}

const MealMap = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export default function FoodPage() {
  const { User, Token } = useAuthStore((state: any) => ({
    User: state.User,
    Token: state.Token,
  }));

  const router = useRouter();

  useEffect(() => {
    if (!User?.CheckinInfo?.CheckedIn) {
      router.push("/CheckinPage");
    }
  });

  const [MealTokens, setMealTokens] = useState<MealToken[]>();

  // TODO: Implement hot reload based on web sockets on every token spent post scan

  const [ActiveMeal, setActiveMeal] = useState<string>();

  const fetchMealTokens = async () => {
    const activeMeal = await (
      await fetch(`https://${process.env.API_URL}/meal/active`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
    ).json();

    console.log("Active meal: ", activeMeal);

    if (activeMeal?.error === undefined) {
      setActiveMeal(MealMap[activeMeal.type]);
    } else {
      console.log("Error occured with active meal: ", activeMeal);
    }

    const mealTokens = (await (
      await fetch(`https://${process.env.API_URL}/meal/tokens/${User?.Email}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
    ).json()) as any;

    if (mealTokens?.error === undefined) {
      setMealTokens(
        mealTokens
          ?.filter((token: any) => !token.used)
          .map(
            (token: any) =>
              ({
                ID: token.id,
                UserID: token.user_id,
                MealID: token.meal_id,
                Used: token.used,
                UpdatedAt: token.updated_at,
                CreatedAt: token.created_at,
              }) as MealToken,
          ),
      );
    }
  };

  const Registered = useRef<boolean>(false);

  const { Socket } = useSocketService({
    URL: process.env.API_URL as string,

    OnResponse: (data: string) => {
      const response = JSON.parse(data);

      console.log("Response: ", response);

      if (response?.scan) fetchMealTokens();
      else if (response?.UserID) {
        console.log("User registered");
        Registered.current = true;
      }
    },
  });

  if (!Registered.current) Socket.emit("register", User.ID);

  useEffect(() => {
    if (MealTokens === undefined) fetchMealTokens();
  }, [MealTokens]);

  return (
    <>
      {User?.CheckinInfo?.CheckedIn ? (
        <div className="flex flex-col w-screen h-screen gap-10 ">
          <div className="w-screen h-fit flex justify-end items-start  ">
            <Header />
          </div>

          {User?.ID !== undefined &&
          ActiveMeal != undefined &&
          MealTokens != undefined ? (
            <Food
              QRCode={User.ID}
              mealToken={MealTokens?.length as number}
              tokenType={ActiveMeal.toLowerCase()}
            ></Food>
          ) : (
            <>{ActiveMeal == undefined ? "No active meals" : <>Loading</>}</>
          )}
        </div>
      ) : (
        <div className="w-screen h-screen flex  justify-center items-center gap-32">
          <Circles />
        </div>
      )}
    </>
  );
}
