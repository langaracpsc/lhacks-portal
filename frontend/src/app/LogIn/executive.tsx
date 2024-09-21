// page for qrCode scan by executives

import { Scanner } from "@yudiel/react-qr-scanner";
import { useAuthStore } from "../Store/AuthStore";
import React, { useEffect, useReducer, useRef, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

export default function ScanQrCode({ Type }: { Type: number }) {
  const [, update] = useReducer((x) => x + 1, 0);

  const { onOpen, onOpenChange } = useDisclosure();

  const [isOpen, setIsOpen] = useState<boolean>();

  const scanId = useRef<string>();

  const { user, token } = useAuthStore((state: any) => ({
    user: state.User,
    token: state.Token,
  }));

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
                      Confirm token scan for {user.FullName}?
                    </ModalBody>
                    <Button
                      onClick={async () => {
                        createScan(scanId.current as string).then(
                          (response: any) => {
                            setIsOpen(false);
                            if (response?.error) alert(response?.error);
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
            setIsOpen(true);
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
