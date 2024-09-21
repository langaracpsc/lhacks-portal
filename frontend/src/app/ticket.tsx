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
    <div className="flex flex-col justify-center items-center rounded-lg gap-4 sm:gap-6 md:gap-8 w-full max-w-sm px-4">
      <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
        <Canvas
          text={QRCode}
          options={{
            errorCorrectionLevel: "M",
            margin: 3,
            scale: 4,
            width: 300,
          }}
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center items-start w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
        <div className="flex flex-row gap-2 flex-wrap">
          <p className="text-2xl sm:text-3xl font-bold text-orange-500">
            {Name}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-orange-500">
            {FName}
          </p>
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Status:{" "}
          <span className="text-orange-500 text-lg sm:text-xl md:text-2xl">
            {Status ? "Checked in" : "Not Checked in"}
          </span>
        </p>
        {CheckInTime !== "Invalid Date" && (
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Check in date:{" "}
            <span className="text-orange-500 text-lg sm:text-xl md:text-2xl">
              {CheckInTime}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
