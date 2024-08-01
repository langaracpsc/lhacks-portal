"use client"
import {Input} from "@nextui-org/input";
import { useState } from "react";

import {Button, ButtonGroup} from "@nextui-org/button";
import LoginComponent from "./LoginComponet";


export default function  LogedInPage(){

    



    return(<>


        <div className="w-screen flex flex-col justify-center items-center h-screen  gap-10">

            <h1 className="text-white text-2xl">Login as a Executive</h1>
    <LoginComponent endpoint={""} goToUrlSucess={""} goToUrlFail={""}/>
    </div>
   

        
       



        
    
    
    </>)
}