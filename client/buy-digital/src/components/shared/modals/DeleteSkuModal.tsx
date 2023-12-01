import { FC } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

const DeleteSkuModal: 
FC<{ 
  deleteSku: () => void,
  setOpenModal: Function,
  openModal: boolean,
  loading: boolean,
  skuName: string
}> = ({ setOpenModal, openModal, deleteSku, loading, skuName }) => {

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
        Do you really want to delete {`"${skuName}"`}?
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
              onClick={() => deleteSku()}
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

export default DeleteSkuModal