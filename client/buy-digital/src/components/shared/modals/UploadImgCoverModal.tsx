"use client"

import { productEndpoints } from "@/services/product.service"
import { FC, useContext, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

import { RootContext } from "context"
import { showAppToast } from "@/utilities/apptoastutils"
import { expiredToken } from "@/utilities/verificationutils"

const UploadImgCoverModal:FC<{
  productId: string,
  setOpenModal: Function,
  openModal: boolean 
}> = ({ setOpenModal, openModal, productId }) => {
  const rootContext = useContext(RootContext)
  const [loading, setLoading] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const uploadAction = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user') as string)

    if(!userInfo) {
      showAppToast(rootContext, 'Can\'t find user. Please login again.')
      return
    }

    try {
      setLoading(true)
      if(!imageFile) {
        showAppToast(rootContext, 'No File Selected.')
        setLoading(false)
        return
      }

      const { success } = 
        await productEndpoints.
        uploadProductImageCover(
          productId, 
          imageFile,
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
        <h6>Upload Cover Image</h6>
        <input 
          type="file" 
          accept="image/png"
          onChange={(e) => 
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
        />
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
                variant="primary" 
                onClick={() => uploadAction()}
              >
                Upload
              </Button>
            </>
          ) :
          <p>Loading...</p>
        }
      </Modal.Footer>
    </Modal>
  )
}

export default UploadImgCoverModal