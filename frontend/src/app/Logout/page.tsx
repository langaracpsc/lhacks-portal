"use client";
import { useEffect, useRef } from "react";
import Header from "../header";
import { useAuthStore, User } from "../Store/AuthStore";
import Ticket from "../ticket";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { User, Token } = useAuthStore((state: any) => ({
    User: state.User,
    Token: state.Token,
  }));

  const router = useRouter();

  const checkedIn = useRef<boolean>(false);

  if (User?.CheckinInfo?.CheckedIn !== undefined)
    checkedIn.current = User?.CheckinInfo?.CheckedIn;

  const logOut = async () => {
    let response;

    try {
      response = await (
        await fetch(`https://${process.env.API_URL}/auth/logout`, {
          method: "POST",
          mode: "no-cors",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        })
      ).json();
    } catch (e) {
      console.log(e);
    }

    return response;
  };

  const SetToken = useAuthStore((state: any) => state.SetToken);
  const SetUser = useAuthStore((state: any) => state.SetUser);
  const CheckIn = useAuthStore((state: any) => state.CheckIn);

  useEffect(() => {
    logOut().then((response) => {
      console.log(response);
      SetToken(null);
      SetUser(null);
      CheckIn(false);

      if (localStorage) localStorage.removeItem("authStore");

      router.push("/");
    });
  }, [User, Token]);

  return (
    <>
      <div className=" flex flex-col w-screen h-full  items-center bg-black gap-16">
        Logging Out
      </div>
    </>
  );
}
