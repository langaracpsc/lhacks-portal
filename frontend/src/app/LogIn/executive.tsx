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

  const token = useAuthStore((state: any) => state.Token);

  const createScan = async (id: string) => {
    const response = await (
      await fetch(`https://${process.env.API_URL}/scan/create`, {
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

    // alert(`Code scanned: ${response.scan.user_id}: ${id}`);
    // update();
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
                      Confirm token scan for {scanId.current}?
                    </ModalBody>
                    <Button
                      onClick={async () => {
                        createScan(scanId.current as string).then(() => {
                          setIsOpen(false);
                        });
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
                      Close
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
