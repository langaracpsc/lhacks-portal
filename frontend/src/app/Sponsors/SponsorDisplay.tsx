import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../Store/AuthStore";
import { Circles } from "react-loading-icons";

import Microserve from "../../../public/MicroserveMicroUpdate.svg";
import Samsung from "../../../public/SamsungSamsungUpdate.svg";
import Defang from "../../../public/DefangDefangUpdateTwo.svg";
import LangaraAP from "../../../public/VectorLangaraApplieScienceUpdate.svg";
import LangaraCS from "../../../public/VectorLangaraCSUpdate.svg";
import LangaraInfoTech from "../../../public/VectorLangaraITupdate.svg";
import LangaraBio from "../../../public/VectorLangaraBio.svg";
import LangaraProvostOffice from "../../../public/VectorLangaraProvost.svg";
import LangaraMath from "../../../public/VectorMathLangaraUpadate2.svg";

interface Sponsor {
  name: string;
  logo: string;
  link: string;
  size: string;
  row: number;
}

const sponsorsData = {
  current: [
    {
      name: "Micro Serve",
      logo: Microserve,
      link: "https://www.microserve.ca/",
      size: "w-48 h-48",
      row: 1,
    },
    {
      name: "Samsung",
      logo: Samsung,
      link: "https://www.samsung.com/ca/",
      size: "w-48 h-48",
      row: 1,
    },
    {
      name: "Defang",
      logo: Defang,
      link: "https://defang.io/",
      size: "w-64 h-64",
      row: 0,
    },
    {
      name: "Langara Information Technology",
      logo: LangaraInfoTech,
      link: "https://langara.ca/information-technology/",
      size: "w-48 h-48",
      row: 2,
    },
    {
      name: "Langara Computer Science",
      logo: LangaraCS,
      link: "https://langara.ca/departments/computer-science/index.html",
      size: "w-48 h-48",
      row: 2,
    },
    {
      name: "Langara Bio Informatics",
      logo: LangaraBio,
      link: "https://langara.ca/programs-and-courses/programs/bioinformatics/index.html",
      size: "w-48 h-48",
      row: 2,
    },
    {
      name: "Langara Applied Science",
      logo: LangaraAP,
      link: "https://langara.ca/programs-and-courses/courses/APSC/index.html",
      size: "w-48 h-48",
      row: 3,
    },
    {
      name: "Langara Mathematics",
      logo: LangaraMath,
      link: "https://langara.ca/departments/mathematics/index.html",
      size: "w-48 h-48",
      row: 3,
    },
    {
      name: "Langara Provost Office",
      logo: LangaraProvostOffice,
      link: "https://langara.ca/about-langara/academics/index.html",
      size: "w-48 h-48",
      row: 3,
    },
  ],
};

const SponsorDisplay: React.FC = () => {
  const { User, Token } = useAuthStore((state: any) => ({
    User: state.User,
    Token: state.Token,
  }));

  const router = useRouter();

  const checkedIn = useRef<boolean>(false);

  if (User?.CheckinInfo?.CheckedIn !== undefined)
    checkedIn.current = User?.CheckinInfo?.CheckedIn;

  try {
    if (!checkedIn.current) router.push("/CheckinPage");
  } catch (e) {
    console.log(e);
  }

  const renderSponsors = (sponsors: Sponsor[]) => {
    const rows: { [key: number]: Sponsor[] } = {};

    sponsors.forEach((sponsor) => {
      if (!rows[sponsor.row]) {
        rows[sponsor.row] = [];
      }
      rows[sponsor.row].push(sponsor);
    });

    return Object.keys(rows).map((row) => (
      <div
        key={row}
        className="flex flex-wrap justify-center items-center gap-10 w-full"
      >
        {rows[parseInt(row)].map((sponsor) => (
          <div
            key={sponsor.name}
            className="flex justify-center items-center w-[200px] h-[200px]"
          >
            <Image
              onClick={() => {
                router.push(sponsor.link);
              }}
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              className="w-max h-max fill-white cursor-pointer"
              height={sponsor.name == "Defang" ? 400 : 200}
              width={sponsor.name == "Defang" ? 400 : 200}
            />
          </div>
        ))}
      </div>
    ));
  };

  return (
    <>
      {checkedIn.current ? (
        <div className="w-full h-screen flex flex-col bg-black">
          <h2 className="text-2xl font-bold p-4 text-center text-white">
            Sponsors
          </h2>
          <div className="flex-grow overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="flex flex-col gap-10 items-center pb-8">
                {renderSponsors(sponsorsData.current)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <Circles />
        </div>
      )}
    </>
  );
};

export default SponsorDisplay;
