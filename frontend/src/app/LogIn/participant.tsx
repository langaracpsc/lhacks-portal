import { useQRCode } from 'next-qrcode';
import React from 'react';

interface ParticipantProps {
    QRCode: string;
}

export default function Participant({ QRCode}: ParticipantProps) {
  const { Canvas } = useQRCode();
  return (
    <div className="flex flex-col text-white rounded-lg gap-5 max-w-[90%]">
        <Canvas
          text={QRCode}
          options={{
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 300,

          }}
        />
        <p className="text-6xl font-bold text-orange-500">Langara</p>
        <p className="text-6xl font-bold ">Hacks 2024</p>
        <p className="text-xl text-orange-500">Live Portal</p>
    </div>
  );
}