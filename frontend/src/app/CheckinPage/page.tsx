"use client"
import Header from "../header";
import Participant from "../LogIn/participant";
import Ticket from "../ticket";





export default function CheckInPage(){
    return(<>
    
    
    <div className=" flex flex-col w-screen h-screen  items-center">

    <div className="w-screen h-screen flex justify-end items-start   ">
                <Header/>
            </div>
    <Ticket QRCode='qgwqfkecywquegckyuwegcqwyuegcwer' Name='Serhii' FName='Ambartsumian' Status={true} CheckInTime='25-08-2004 14:30'/>
    </div>
    
    
    </>)
}