"use client"

import { useEffect, useState } from "react";
import Food from "../food";
import Header from "../header";
import { useAuthStore } from "../Store/AuthStore";
import { waitForDebugger } from "inspector";

interface MealToken 
{ 
    ID: string,
    UserID: string
    MealID: string
    Used: boolean
    UpdatedAt: number
    CreatedAt: number
}

export default function FoodPage() {
    const {User, Token} = useAuthStore((state: any) => ({ User: state.User, Token: state.Token })); 

    const [MealTokens, setMealTokens] = useState<MealToken[]>();
    
    // TODO: Implement hot reload based on SSE on every token spent post scan 
        
    const fetchMealTokens = async () => {
        const mealTokens = (await (await fetch(`http://100.73.91.105:5001/meal/tokens/${User?.Email}`)).json()) as any[];

        setMealTokens(mealTokens?.filter(token => !token.used).map(token => ({
            ID: token.id,
            UserID: token.user_id,
            MealID: token.meal_id,
            Used: token.used,
            UpdatedAt: token.updated_at,
            CreatedAt: token.created_at
        } as MealToken)));
    };

    useEffect(() => {
        if (User?.ID !== undefined) {
            fetchMealTokens();
            console.log(MealTokens);
        }
    }, [User]);

    return (<>
        <div className="w-screen h-screen flex flex-col items-center gap-32 ">
            <div className="w-screen h-screen flex justify-end items-start  ">
                <Header />
            </div>
      
            {(User?.ID !== undefined) ? <Food QRCode={User.ID} mealToken={(MealTokens?.length as number)} tokenType='breakfast'></Food> : <>Loading</>}
        </div>

    </>)
}