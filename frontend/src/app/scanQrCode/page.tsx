"use client";
import { useRef, useState } from "react";
import Header from "../header";
import ScanQrCode from "../LogIn/executive";
import { Select, SelectItem } from "@nextui-org/select";

export default function PageToScan() {
  // const [isOpen, setIsOpen] = useState(false);
  const scanType = useRef<any>();

  const [type, setType] = useState<number>();

  return (
    <>
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
            <Select
              items={[
                { key: 0, label: "Check In" },
                { key: 1, label: "Food" },
              ]}
              label={"Select Scan Type"}
              className={"w-screen"}
              ref={scanType}
              onChange={(target: any) => {
                setType(parseInt(target?.target?.value as string));
              }}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </div>
          <ScanQrCode Type={type as number} />
        </div>
      </div>
    </>
  );
}
