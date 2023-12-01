"use client"

import { FC, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

const MessageModal: FC<{ message: string, title: string }> = ({ message, title }) => {
  const [openModal, setOpenModal] = useState(true)

  return (
    <Modal
      show={openModal}
      onHide={() => setOpenModal(false)}
      backdrop="static"
      keyboard={false}
      style={{padding: 0}}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setOpenModal(false)}>
          Cancel
        </Button>
        <Button variant="primary">Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MessageModal