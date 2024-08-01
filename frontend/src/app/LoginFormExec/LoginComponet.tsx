"use client"
import {Input} from "@nextui-org/input";
import { HtmlHTMLAttributes, useState } from "react";


import {Button, ButtonGroup} from "@nextui-org/button";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ContentToBeConsideredLogin{
    endpoint:string,
    goToUrlSucess:string,
    goToUrlFail:string


}


export default function  LoginComponent(description:ContentToBeConsideredLogin){

    const router = useRouter();
    
    const [data, setData]= useState<object>({})

    async function sendData(){

        console.log(data)
        
        // const contentFromBackend = await axios.post(description.endpoint,{
        //     ...data
        // })

        // if(contentFromBackend.status == 200){
        //     router.push(description.goToUrlSucess)
        // }else{
        //     router.push(description.goToUrlFail)
        // }

        
    }


    return(<>


   

    <div className="flex flex-col  w-3/5  max-w-[430px]:w-4/5    gap-5">
    <div className="flex flex-col">
    <label htmlFor="email" className="text-sm font-medium mb-2 text-white">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="text-orange-500 placeholder-orange-500 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-orange-500 focus:ring-1"
          placeholder="Enter your Email"
          
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="username" className="text-sm font-medium mb-2 text-white">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="text-orange-500 placeholder-orange-500 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-orange-500 focus:ring-1"
          placeholder="Enter your Username"
       
          onChange={(e) => setData({ ...data, username: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-sm font-medium mb-2 text-white">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="text-orange-500 placeholder-orange-500 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-orange-500 focus:ring-1"
          placeholder="Enter your Password"
       
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="passwordMatch" className="text-sm font-medium mb-2 text-white">Confirm Password</label>
        <input
          type="password"
          id="passwordMatch"
          name="passwordMatch"
          className="text-orange-500 placeholder-orange-500 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-orange-500 focus:ring-1"
          placeholder="Enter your Password"
         
          onChange={(e) => setData({ ...data, passwordMatch: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        onClick={(e)=>{
            e.preventDefault()
            sendData()
        }}
        className="text-black bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-md text-sm px-5 py-2.5   
 shadow-md hover:text-white"
        
      >
        Login
      </button>
    </div>
        

        
       



        
    
    
    </>)
}