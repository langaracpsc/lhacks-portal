"use client"

import { useEffect, useState } from "react";
import Food from "../food";
import Header from "../header";
import { useAuthStore } from "../Store/AuthStore";
import { waitForDebugger } from "inspector";
import { setDefaultAutoSelectFamily } from "net";

interface MealToken {
    ID: string,
    UserID: string
    MealID: string
    Used: boolean
    UpdatedAt: number
    CreatedAt: number
}

const MealMap = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export default function FoodPage() {
    const { User, Token } = useAuthStore((state: any) => ({ User: state.User, Token: state.Token }));

    const [MealTokens, setMealTokens] = useState<MealToken[]>();

    // TODO: Implement hot reload based on web sockets on every token spent post scan 

    const [ActiveMeal, setActiveMeal] = useState<string>();

    console.log("Token: ", Token);

    const fetchMealTokens = async () => {
        const activeMeal = (await (await fetch(`https://${process.env.API_URL}/meal/active`, {
            headers: {
                "Authorization": `Bearer ${Token}`
            }
        })).json());

        if (activeMeal?.error === undefined) {
            setActiveMeal(MealMap[activeMeal.type]);
        }

        const mealTokens = (await (await fetch(`https://${process.env.API_URL}/meal/tokens/${User?.Email}`,  {
            headers: {
                "Authorization": `Bearer ${Token}`
            }
        })).json()) as any;

        if (mealTokens?.error === undefined) {
            setMealTokens(mealTokens?.filter((token: any) => !token.used).map((token: any) => ({
                ID: token.id,
                UserID: token.user_id,
                MealID: token.meal_id,
                Used: token.used,
                UpdatedAt: token.updated_at,
                CreatedAt: token.created_at
            } as MealToken)));
        }
    };

    useEffect(() => {
        if (User?.ID !== undefined && Token != null) {
            fetchMealTokens();
            console.log(MealTokens);
        }
    }, [User]);

    return (<>
        <div className="w-screen h-screen flex flex-col items-center gap-32 ">
            <div className="w-screen h-screen flex justify-end items-start  ">
                <Header />
            </div>

            {(User?.ID !== undefined && ActiveMeal != undefined && MealTokens != undefined) ? <Food QRCode={User.ID} mealToken={(MealTokens?.length as number)} tokenType={ActiveMeal.toLowerCase()}></Food> : <>{(ActiveMeal == undefined) ? "No active meals" : <>Loading</>}</>}
        </div>
    </>)
}