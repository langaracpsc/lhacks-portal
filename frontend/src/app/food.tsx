import { useQRCode } from "next-qrcode";
import React, { MutableRefObject, useReducer } from "react";

interface FoodProps {
  mealToken: number;
  tokenType: string;
  QRCode: string;
  forceRender: MutableRefObject<() => void>;
}

export default function Food({
  QRCode,
  mealToken,
  tokenType,
  forceRender,
}: FoodProps) {
  const { Canvas } = useQRCode();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  forceRender.current = forceUpdate;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm px-4">
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
      <div className="flex flex-col gap-4 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mt-8 text-center">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Your available {tokenType} meals:
        </p>
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500">
          {mealToken}
        </p>
      </div>
    </div>
  );
}
