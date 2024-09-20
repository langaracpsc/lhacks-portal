"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Food from "../food";
import Header from "../header";
import { useAuthStore } from "../Store/AuthStore";
import { waitForDebugger } from "inspector";
import { setDefaultAutoSelectFamily } from "net";
import { useRouter } from "next/navigation";
import LoadingIcons, { Circles } from "react-loading-icons";
import useSocketService from "../hooks/useSocketService";
import { Oi } from "next/font/google";

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

    console.log(mealTokens);

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

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const foodForceRender = useRef<() => void>(() => {});

  const Registered = useRef<boolean>(false);

  const { Socket } = useSocketService({
    URL: process.env.API_URL as string,

    OnResponse: (data: string) => {
      const response = JSON.parse(data);

      console.log("Response: ", response);

      if (response?.scan && User?.ID) {
        fetchMealTokens().then(() => {
          forceUpdate();
          foodForceRender.current();
        });
      } else if (response?.UserID) {
        console.log("User registered");
        Registered.current = true;
      }
    },
  });

  if (!Registered.current) Socket.emit("register", User.ID);

  console.log(`Socket session in foodSection: ${Socket.id}`);
  if (MealTokens === undefined) fetchMealTokens();

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
            <div className="flex flex-col gap-2">
              <Food
                QRCode={User.ID}
                mealToken={MealTokens?.length as number}
                tokenType={ActiveMeal.toLowerCase()}
                forceRender={foodForceRender}
              ></Food>
              {!User?.DietaryRestriction ? (
                <></>
              ) : (
                <div className="flex items-center text-white self-center gap-2">
                  <span className="font-bold">Dietary restriction:</span>
                  <span>{User?.DietaryRestriction}</span>
                </div>
              )}
            </div>
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
