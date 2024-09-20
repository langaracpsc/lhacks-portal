import { useQRCode } from "next-qrcode";
import React from "react";

interface TicketProps {
  QRCode: string;
  Name: string;
  FName: string;
  Status: boolean;
  CheckInTime: string;
}

export default function Ticket({
  QRCode,
  Name,
  FName,
  Status,
  CheckInTime,
}: TicketProps) {
  const { Canvas } = useQRCode();
  return (
    <div className="flex flex-col justify-center items-center rounded-lg gap-8 w-screen">
      <Canvas
        text={QRCode}
        options={{
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 360,
        }}
      />
      <div className="flex flex-col  gap-5 justify-center items-start w-[360px]  ">
        <div className="flex flex-row gap-2">
          <p className="text-3xl font-bold text-orange-500 ">{Name}</p>
          <p className="text-3xl font-bold  text-orange-500">{FName}</p>
        </div>
        <p className="text-3xl font-bold text-white">
          Status:{" "}
          <span className="text-orange-500 text-2xl">
            {Status ? "Checked in" : "Not Checked in"}
          </span>
        </p>
        {CheckInTime == "Invalid Date" ? (
          <></>
        ) : (
          <p className="text-3xl font-bold text-white">
            Check in date:{" "}
            <span className="text-orange-500 text-2xl">{CheckInTime}</span>
          </p>
        )}
      </div>
    </div>
  );
}
