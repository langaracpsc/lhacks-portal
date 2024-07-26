import { useQRCode } from 'next-qrcode';
import React from 'react';

interface TicketProps {
    QRCode: string;
    Name: string;
    FName: string;
    Status: boolean;
    CheckInTime: string;
}

export default function Ticket({ QRCode, Name, FName, Status, CheckInTime }: TicketProps) {
  const { Canvas } = useQRCode();
  return (
    <div className="flex flex-col justify-center items-center rounded-lg gap-8 max-w-[90%]">
        <Canvas
          text={QRCode}
          options={{
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 300,

          }}
        />
        <div className='flex flex-col gap-5 '>
          <p className="text-3xl font-bold ">{Name}</p>
          <p className="text-3xl font-bold ">{FName}</p>
          <p className="text-3xl font-bold ">Status: <span className='text-orange-500'>{Status ? "Checked in" : "Not Checked in"}</span></p>
          <p className="text-3xl font-bold ">Check in date: <span className='text-orange-500'>{CheckInTime} </span></p>
        </div>
    </div>
  );
}