// page for qrCode scan by executives

import { Scanner } from "@yudiel/react-qr-scanner";
import { useAuthStore, User } from "../Store/AuthStore";
import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { fetchUserInfo } from "../user/service";

export default function ScanQrCode({ Type }: { Type: number }) {
  const [, update] = useReducer((x) => x + 1, 0);

  const { onOpen, onOpenChange } = useDisclosure();

  const [isOpen, setIsOpen] = useState<boolean>();

  const scanId = useRef<string>();

  const { token } = useAuthStore((state: any) => ({
    token: state.Token,
  }));

  const [user, setUser] = useState<User>();

  const createScan = async (id: string): Promise<any> => {
    const response = await (
      await fetch(`https://${process?.env.API_URL}/scan/create`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          userid: id,
          type: Type,
          meal: "Lunch",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();

    return response;
  };

  const ConfirmationModal = ({ isOpen }: { isOpen: boolean }) => {
    return (
      <>
        {isOpen ? (
          <div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose: any) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Confirm?
                    </ModalHeader>
                    <ModalBody>
                      Confirm token scan for {user?.FullName}?
                    </ModalBody>
                    <Button
                      onClick={async () => {
                        createScan(scanId.current as string).then(
                          (response: any) => {
                            setIsOpen(false);
                            if (
                              response?.error &&
                              response?.error?.toLowerCase().search("emit") < 0
                            ) {
                              alert(response?.error);
                            } else {
                              alert(`Scan created for ${user?.FullName}`);
                            }
                          },
                        );
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        onClose();
                      }}
                    >
                      No
                    </Button>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const App = () => {
    return (
      <Scanner
        scanDelay={1000}
        onScan={(result) => {
          if (result.length > 0) {
            scanId.current = result[0].rawValue;

            fetchUserInfo(scanId.current, token).then((response: User) => {
              setUser(response);
              setIsOpen(true);
            });
          }
        }}
      />
    );
  };

  return (
    <>
      <div className="w-52 h-52 ">
        <ConfirmationModal isOpen={isOpen as boolean} />
        <App />
      </div>
    </>
  );
}
