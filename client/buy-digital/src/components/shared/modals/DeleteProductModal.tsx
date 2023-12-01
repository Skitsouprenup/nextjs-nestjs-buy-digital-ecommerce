"use client"

import { expiredToken } from "@/utilities/verificationutils"
import { FC, useContext, useState, /*useEffect, useRef */ } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

import { RootContext } from "context"
import { showAppToast } from "@/utilities/apptoastutils"
import { productEndpoints } from "@/services/product.service"

const DeleteProductModal: 
FC<{ 
  productName: string,
  productId: string,
  setOpenModal: Function,
  openModal: boolean 
}> = ({ productName, setOpenModal, openModal, productId }) => {
  //const modalRef = useRef<Record<string, unknown>>(null)
  const rootContext = useContext(RootContext)
  const [loading, setLoading] = useState<boolean>(false)

  const delAction = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user') as string)

    if(!userInfo) {
      showAppToast(rootContext, 'Can\'t find user. Please login again.')
      return
    }

    try{
      setLoading(true)
      const { success } = 
        await productEndpoints.deleteProduct(
          productId,
          {
            headers: {
              'Authorization': `Bearer ${userInfo?.token}`
            }
          }
        )

      if(success) location.reload()
      else setLoading(false)
    }
    catch(error) {
      console.error(error)

      const errorData = error as 
        { response: { data: { exception: Record<string, unknown> } }}

      if(!expiredToken(
        errorData.response.data.exception?.name as string,
        rootContext
      )) showAppToast(rootContext, 'Something went wrong!')

      setLoading(false)
    }
  }

  /*
  useEffect(() => {
    if(openModal) {
      const modalWrapper: HTMLDivElement = 
        modalRef.current?.dialog as HTMLDivElement

      //Can't access padding-right. Dunno why.
      console.log(modalWrapper.style.item(1))
    }
  }, [openModal])
  */

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
          Do you really want to delete {`"${productName}"`}?
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
                onClick={() => delAction()}
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

export default DeleteProductModal