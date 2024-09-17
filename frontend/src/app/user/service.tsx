import { CheckInInfo, User } from "../Store/AuthStore";

async function fetchCheckinInfo(
  user: User,
  token: string,
): Promise<CheckInInfo> {
  return (await (
    await fetch(`https://${process.env.API_URL}/user/checkedin/${user.Email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).json()) as CheckInInfo;
}

export { fetchCheckinInfo };
