"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function callback() {
    const searchParams = useSearchParams();
    const uuid: string | null = searchParams.get("uuid");

    const [token, setToken] = useState<string>();

    const router = useRouter();

    useEffect( () => {
        (async () => {
            if (token === undefined) 
            {
                const response: any = (await (await fetch(`http://127.0.0.1:5000/auth/token/${uuid}`)).json());

                console.log(response)

                setToken(response?.token);
            }
        })();
    }, [uuid, token]);
    
    useEffect( () => {
    if (sessionStorage !== undefined && token != undefined) {
        sessionStorage.setItem("token", token || "None");
        router.push("/CheckinPage");
    }}, [token, router]);

    return <>
    Authorizing
    </>;
}