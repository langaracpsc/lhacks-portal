"use client"

import Header from "../header";
import Schedule from "../schedule";

const events = [
    { time: '6:00', title: 'Hackathon Begins', date: 'September 21' },
    { time: '10:30', title: 'Mini event 1', date: 'September 21' },
    { time: '18:30', title: 'End of the day', date: 'September 21' },
    { time: '9:00', title: 'The Beginning of next day', date: 'September 21' },
    { time: '10:30', title: 'Mini event 1', date: 'September 22' },
    { time: '18:30', title: 'End of the day', date: 'September 22' },
    { time: '9:00', title: 'The Beginning of next day', date: 'September 22' }
  ];


export default function  TimerPage(){


    return(<>
    
        
      <div className="  flex flex-col w-screen h-screen">

      <div className="w-screen h-screen  flex justify-end items-start  ">
                <Header/>
            </div>
        
        <Schedule events={events} />
        
      </div>
    </>)



}