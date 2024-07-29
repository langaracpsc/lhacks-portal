"use client"
import { useState } from "react";
import Header from "../header";
import ScanQrCode from "../LogIn/executive";
import Hamburger from "hamburger-react";



export default function PageToScan(){
    const [isOpen, setIsOpen] = useState(false);

    return(<>

        <div className="w-screen h-screen flex flex-col items-center gap-32 overflow-x-hidden ">
            <div className="w-screen   flex justify-end items-start  overflow-x-hidden ">
                <Header/>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
            <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-white text-3xl">Execs Only</h1>
            <h1 className="text-orange-500 text-xl">Scan over the QR Code</h1>
            </div>
            <ScanQrCode/>
            </div>
        </div>
    </>)

}