"use client"

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckInInfo, useAuthStore, User } from "../Store/AuthStore";
import { select } from "@nextui-org/theme";

function CallbackComponent() {
    const searchParams = useSearchParams();
    const uuid: string | null = searchParams.get("uuid");

    const SetToken = useAuthStore((state: any) => (state.SetToken));
    const SetUser = useAuthStore((state: any) => (state.SetUser));
    const CheckIn = useAuthStore((state: any) => (state.CheckIn))

    const authStore = useAuthStore();
    
    const [response, setResponse] = useState<any>();

    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (response == undefined) {
                fetch(`https://${process.env.API_URL}/auth/token/${uuid}`)
                    .then(r => r.json().then(j =>  { setResponse(j)} ));
            }
        })();
    }, [uuid, response]);

    const selected = useAuthStore((state: any) => ([state.User, state.Token]));

    useEffect(() => {
        let checkinResponse: any;

        const fetchCheckinInfo = async (user: User) => {
            checkinResponse = (await (await fetch(`https://${process.env.API_URL}/user/checkedin/${user.Email}`, {
                headers: {
                    "Authorization": `Bearer ${selected[0]}`
                }
            })).json()) as CheckInInfo;
        };

        if (response?.token && response?.user) {
            const user: User = response?.user;

            SetToken(response?.token);
            SetUser(user);

            fetchCheckinInfo(user).then(() => {
                CheckIn(user, { CheckedIn: checkinResponse.checked_in, Time: checkinResponse?.scan?.created_at });
                router.push("/CheckinPage");
            });
        }
    }, [response, router]);

    return <>
        Authorizing
    </>;
}

export default function Callback() {
    return (
        <Suspense>
            <CallbackComponent />
        </Suspense>
    );
}