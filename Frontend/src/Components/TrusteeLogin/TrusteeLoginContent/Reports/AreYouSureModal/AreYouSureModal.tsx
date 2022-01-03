import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function AreYouSureModal(props: {
  modalOpen: boolean;
  header: string;
  bodyText: string;
  yesButtonAction: () => void;
  noButtonAction: () => void;
}) {
  return (
    <Modal isOpen={props.modalOpen} toggle={props.noButtonAction}>
      <ModalHeader toggle={props.noButtonAction}>{props.header}</ModalHeader>
      <ModalBody>{props.bodyText}</ModalBody>
      <ModalFooter>
        <Button onClick={props.yesButtonAction}>Yes</Button>
        <Button onClick={props.noButtonAction}>No</Button>
      </ModalFooter>
    </Modal>
  );
}
