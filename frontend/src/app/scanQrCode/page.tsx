"use client"
import { MutableRefObject, useRef, useState } from "react";
import Header from "../header";
import ScanQrCode from "../LogIn/executive";
import Hamburger from "hamburger-react";
import { Select, SelectItem } from "@nextui-org/select";

export default function PageToScan() {
    // const [isOpen, setIsOpen] = useState(false);
    const scanType = useRef<MutableRefObject<HTMLSelectElement>>();

    console.log("selection: ", scanType.current?.current.value); 

    return (<>
        <div className="w-screen h-screen flex flex-col items-center gap-32 overflow-x-hidden ">
            <div className="w-screen   flex justify-end items-start  overflow-x-hidden ">
                <Header />
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
                <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-white text-3xl">Execs Only</h1>
                    <h1 className="text-orange-500 text-xl">Scan over the QR Code</h1>
                </div>
                <div>
                    <Select items={[
                        { key: 0, label: "Check In" },
                        { key: 1, label: "Food" }
                    ]} ref={scanType}>
                        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                    </Select>
                </div>
                <ScanQrCode Type={1} />
            </div>
        </div>
    </>)
}