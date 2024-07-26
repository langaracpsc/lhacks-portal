import React from 'react';


export default function Choice() {
  return (
    <div className="flex flex-col items-start gap-8 w-[100vw]">
      <p className="p-4 text-2xl">Log on as:</p>
      <div className="border-b-2">
        <button className="font-bold text-orange-500 text-3xl px-6 py-2 bg-none rounded">
          Executive
        </button>
        </div>
        <div className="border-b-2">
        <button className="font-bold text-3xl px-6 py-2 bg-none text-white rounded">
          Participant
        </button>
      </div>
    </div>
  );
}