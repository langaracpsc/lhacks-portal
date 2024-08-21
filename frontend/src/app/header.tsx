'use client';
import { useState, useEffect } from 'react';
import Hamburger from 'hamburger-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image'
import svggroup from "./Group_38.svg"
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()

    const [displayCheck, setDisplayCheck] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    // useEffect(() => { // why?
    //     console.log(isOpen)
    // }, [isOpen])
    const toggleNavBar = () => {
        setIsOpen(!isOpen);
    };

    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1000) {
                setDisplayCheck(false);
            }
            else {
                setDisplayCheck(true);
            }
        };


        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    function specialAnimationHandle(whichEnd: string) {
        toggleNavBar()
        if (pathname == "/") {

            router.push("#" + whichEnd)
            router.refresh()


        } else {
            router.push("#" + whichEnd)

        }
    }

    // picture not full screen as it was
    return (
        <>
            <div className={`z-20 bg-black w-screen     h-screen absolute  ${isOpen ? "visible animate-slide-in  overflow-y-hidden " : "hidden "}`}>
                <div className={"  flex flex-col w-screen  items-start justify-center gap-8 "}>
                    <p className="p-4 text-2xl">Log on as:</p>
                    <div className={"border-b-2 hover:border-orange-500 [&>*]:hover:text-orange-500"}>
                        <button onClick={() => { 
                            setIsOpen(false);
                            router.push("/CheckinPage");
                        }} className={"font-bold hover:text-orange-500 text-white text-3xl px-6 py-2 bg-none rounded"}>
                            My Ticket
                        </button>
                    </div>
                    <div className="border-b-2 hover:border-orange-500 [&>*]:hover:text-orange-500">
                        <button onClick={() => { 
                            setIsOpen(false);
                            router.push("/Timer");
                        }} className="font-bold text-3xl px-6 py-2 bg-none hover:text-orange-500 text-white rounded">
                            Schedule
                        </button>
                    </div>
                    <div className="border-b-2 hover:border-orange-500 [&>*]:hover:text-orange-500">
                        <button onClick={() => { 
                            setIsOpen(false);
                            router.push("/foodSection");
                            }} className="font-bold text-3xl px-6 py-2 bg-none hover:text-orange-500 text-white rounded">
                            Meals
                        </button>
                    </div>
                    <div className="border-b-2 hover:border-orange-500 [&>*]:hover:text-orange-500">
                        <button onClick={() => { 
                            setIsOpen(false);
                            router.push("/Sponsors");
                        }} className="font-bold text-3xl px-6 py-2 bg-none hover:text-orange-500 text-white rounded">
                            Sponsors
                        </button>
                    </div>
                </div>


            </div>

            <div className={`  ${isOpen ? "z-20" : "z-10"} pt-3 pr-4`}>
                <Hamburger color='white' toggled={isOpen} toggle={setIsOpen} />
            </div>

        </>
    );
}