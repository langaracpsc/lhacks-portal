"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckInInfo, useAuthStore, User } from "../Store/AuthStore";

export default function callback() {
    const searchParams = useSearchParams();
    const uuid: string | null = searchParams.get("uuid");

    const SetToken = useAuthStore((state: any) => (state.SetToken));
    const SetUser = useAuthStore((state: any) => (state.SetUser));
    const CheckIn = useAuthStore((state: any) => (state.CheckIn))

    const [response, setResponse] = useState<any>();
    
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (response === undefined)
                setResponse((await (await fetch(`http://127.0.0.1:5000/auth/token/${uuid}`)).json()));
        })();
    }, [uuid, response]);

    const selected = useAuthStore((state: any) => ([state.User, state.Token]));

    useEffect(() => {
        let checkinResponse: any;

        const fetchCheckinInfo = async (user: User) => {
            checkinResponse = (await (await fetch(`http://127.0.0.1:5000/user/checkedin/${user.Email}`)).json()) as CheckInInfo;
        }; 

        if (response?.token && response?.user) {
            const user: User = response?.user;

            SetToken(response?.token);
            SetUser(user);
            
            
            fetchCheckinInfo(user).then(() => {
                CheckIn(user, { CheckedIn: checkinResponse.checked_in, Time: checkinResponse.scan.created_at });
                router.push("/CheckinPage");
            });
        }
    }, [response, router]);

    return <>
        Authorizing
    </>;
}