"use client"

import Food from "../food";
import Header from "../header";



export default function FoodPage() {


    return (<>

        <div className="w-screen h-screen flex flex-col items-center gap-32 ">
            <div className="w-screen h-screen flex justify-end items-start  ">
                <Header />
            </div>
      
                
            <Food QRCode="Hello How are u doing?" mealToken={2} tokenType='breakfast'></Food>
            
        </div>

       


    </>)
}