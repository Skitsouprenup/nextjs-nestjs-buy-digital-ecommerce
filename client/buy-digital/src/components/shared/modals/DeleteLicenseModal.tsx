import React, { FC } from 'react'

import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

const DeleteLicenseModal:FC<{
  deleteLicense: () => void,
  setOpenModal: Function,
  openModal: boolean,
  loading: boolean,
  licenseKey: string
}> = ({ deleteLicense, setOpenModal, openModal, loading, licenseKey }) => {
  return (
    <Modal
      show={openModal}
      onHide={() => {
        if(!loading) setOpenModal(false)
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you really want to delete {`"${licenseKey}"`} license key?
      </Modal.Body>
      <Modal.Footer>
        {
          !loading ? (
            <>
            <Button 
              variant="secondary" 
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={() => deleteLicense()}
            >
              Delete
            </Button>
            </>
          ) :
          <p>Loading...</p>
        }
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteLicenseModal