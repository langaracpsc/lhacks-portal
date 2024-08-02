"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../Store/AuthStore";

export default function callback() {
    const searchParams = useSearchParams();
    const uuid: string | null = searchParams.get("uuid");

    const SetToken = useAuthStore((state: any) => (state.SetToken));
    const SetUser = useAuthStore((state: any) => (state.SetUser));

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
        if (response?.token && response?.user) {
            SetToken(response?.token);
            SetUser(response?.user);

            console.log("Selected: ", selected);

            router.push("/CheckinPage");
        }
    }, [response, router]);

    return <>
        Authorizing
    </>;
}