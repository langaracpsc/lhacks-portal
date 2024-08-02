"use client"
import Header from "../header";
import Participant from "../LogIn/participant";
import { useAuthStore, User } from "../Store/AuthStore";
import Ticket from "../ticket";

export default function CheckInPage() {
    const { User, Token } = useAuthStore((state: any) => ({User: state.User, Token: state.Token})); 

    const nameSplit = User.FullName?.split(' ');
    
    console.log({
        User, Token
    })

    return (<>
        <div className=" flex flex-col w-screen h-screen  items-center">
            <div className="w-screen h-screen flex justify-end items-start">
                <Header />
            </div>
            { (User.ID !== undefined) ? <Ticket QRCode={User.ID} Name={nameSplit?.[0]} FName={nameSplit?.[1]} Status={User.CheckinInfo.CheckedIn} CheckInTime={new Date(User.CheckinInfo.Time * 1000).toDateString()} /> : <> Loading </>}
        </div>
    </>)
}
