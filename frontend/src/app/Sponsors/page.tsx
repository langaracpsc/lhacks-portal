"use client"

import Image, { StaticImageData } from 'next/image'
import imgMicroService from "../../../public/microserve.svg"
import imgLangara  from "../../../public/images.png"
import imgSamsung from "../../../public/samLogo.png"
import Header from '../header'
import SponsorDisplay from './SponsorDisplay'




export default function SponsorsSection(){


    const pathCol1:Array<StaticImageData>=[imgMicroService,imgLangara]

    const pathCol2:Array<StaticImageData>=[imgSamsung]

    return(<>

    <div className=" w-screen h-max bg-black flex flex-col items-center  ">

    <div className="w-screen h-11/12 flex justify-end items-start ">
                <Header/>
            </div>

       
       <SponsorDisplay/>



    </div>

        
    
    
    </>)

}