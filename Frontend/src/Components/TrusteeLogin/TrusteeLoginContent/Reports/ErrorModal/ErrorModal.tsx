import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function ErrorModal(props: {
  hasError: boolean;
  errorMessage: string;
}) {
  const [modalOpen, setModalOpen] = useState(props.hasError);

  const closeErrorModal = () => {
    setModalOpen(false);
  };

  return (
    <Modal isOpen={modalOpen} toggle={closeErrorModal}>
      <ModalHeader toggle={closeErrorModal}>Error</ModalHeader>
      <ModalBody>{props.errorMessage}</ModalBody>
      <ModalFooter>
        <Button onClick={closeErrorModal}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}
