"use client"

import Image, { StaticImageData } from 'next/image'
import imgMicroService from "../../../public/microserve.svg"
import imgLangara  from "../../../public/images.png"
import imgSamsung from "../../../public/samLogo.png"
import Header from '../header'




export default function SponsorsSection(){


    const pathCol1:Array<StaticImageData>=[imgMicroService,imgLangara]

    const pathCol2:Array<StaticImageData>=[imgSamsung]

    return(<>

    <div className=" w-screen h-screen flex flex-col items-center gap-32 ">

    <div className="w-screen h-11/12 flex justify-end items-start ">
                <Header/>
            </div>

        <div className=" flex flex-row items-baseline justify-around gap-10 ">

            <div className='flex flex-col gap-5'>

                {pathCol1.map((value,_index)=>(
                    <div key={_index} >
                        <Image width={200} height={200} src={value} alt={'Image None'}/>
                    </div>
                ))}

            </div>
            <div className='flex flex-col gap-5'>
            {pathCol2.map((value,_index)=>(
                    <div key={_index} >
                        <Image  width={200} height={200} src={value} alt={'Image None'}/>
                    </div>
                ))}
            </div>



        </div>
        



    </div>

        
    
    
    </>)

}