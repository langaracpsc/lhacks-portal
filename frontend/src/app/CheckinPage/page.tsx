"use client"
import Header from "../header";
import Participant from "../LogIn/participant";
import { useAuthStore } from "../Store/AuthStore";
import Ticket from "../ticket";

export default function CheckInPage() {
    const {User, Token} = useAuthStore((state: any) => ({User: state.User, Token: state.Token})); 

    console.log(User, Token);

    const nameSplit = User.FullName?.split(' ');

    console.log("Namesplit: ", User.FullName)

    return (<>
        <div className=" flex flex-col w-screen h-screen  items-center">
            <div className="w-screen h-screen flex justify-end items-start   ">
                <Header />
            </div>

            { (User.ID !== undefined) ? <Ticket QRCode={User.ID} Name={nameSplit?.[0]} FName={nameSplit?.[1]} Status={true} CheckInTime='25-08-2004 14:30' /> : <> Loading </>}
        </div>
    </>)
}
