import { useQRCode } from 'next-qrcode';
import React from 'react';

interface FoodProps {
  mealToken: number;
  tokenType: string;
  QRCode: string;
}

export default function Food({ QRCode, mealToken, tokenType }: FoodProps) {
  const { Canvas } = useQRCode();
  return (
    <div className="flex flex-col items-center justify-center rounded-lg gap-10 ">
        
        <Canvas
            text={QRCode}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 300,
              
          }}
        />
        <div className='flex flex-col gap-4 max-w-[90%] justify-baseline items-center'>
            <p className="text-3xl font-bold text-white ">Your available {tokenType} meals:</p>
            <p className="text-5xl font-bold text-orange-500">{mealToken}</p>
        </div>

    </div>
  );
}