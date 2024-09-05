'use client';
import { useState, useEffect } from 'react';
import Hamburger from 'hamburger-react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useAuthStore } from './Store/AuthStore';

export default function Header() {
    const pathname = usePathname();

    const [displayCheck, setDisplayCheck] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const { User, Token } = useAuthStore((state: any) => ({User: state.User, Token: state.Token})); 

    const nameSplit = User.FullName?.split(' ');
    
    console.log({
        User, Token
    })
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
            <div className={`z-20 bg-black w-screen ${User.CheckinInfo.CheckedIn ? "":" flex justify-center items-center"}     h-screen absolute  ${isOpen ? "visible animate-slide-in  overflow-y-hidden " : "hidden "}`}>
                {User.CheckinInfo.CheckedIn ?
            
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

                    
                    <div className={`border-b-2 hover:border-orange-500 [&>*]:hover:text-orange-500 ${User.Role == 1? "visible":"hidden"}`} >
                        <button onClick={() => { 
                            setIsOpen(false);
                            router.push("/scanQrCode");
                        }} className="font-bold text-3xl px-6 py-2 bg-none hover:text-orange-500 text-white rounded">
                            Scanner
                        </button>
                    </div>
                    
                    
                    
                </div>
                :
                <div className=' flex justify-center items-center'>

                    <h1 className=' text-white text-xl'>Check in to acces this section</h1>

                </div>
}

            </div>

            <div className={`  ${isOpen ? "z-20" : "z-10"} pt-3 pr-4`}>
                <Hamburger color='white' toggled={isOpen} toggle={setIsOpen} />
            </div>

        </>
    );
}