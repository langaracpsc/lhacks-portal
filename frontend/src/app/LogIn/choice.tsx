import { useRouter } from 'next/navigation';
import React from 'react';


export default function Choice() {

  const router = useRouter()

  return (
    <div className="flex flex-col items-start gap-8 w-[100vw]">
      <p className="p-4 text-2xl text-white">Log on as:</p>
      <div className="border-b-2 hover:border-orange-500 [&>*]:hover:text-orange-500">
        <button onClick={()=>{router.push("/Lo")}} className="font-bold  text-white text-3xl px-6 py-2 bg-none rounded">
          Executive
        </button>
        </div>
        <div className="border-b-2 hover:border-orange-500 [&>*]:hover:text-orange-500">
        <button onClick={()=>{router.push("/LoginForm")}} className="font-bold text-3xl px-6 py-2 bg-none  text-white rounded">
          Participant
        </button>
      </div>
    </div>
  );
}