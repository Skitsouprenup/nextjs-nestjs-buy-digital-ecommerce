"use client"

import DeleteProductModal from "@/components/shared/modals/DeleteProductModal"
import UploadImgCoverModal from "@/components/shared/modals/UploadImgCoverModal"
import { FC, useEffect, useState } from "react"

const ModalList:
FC<{
  modalType: string,
  setModalType: Function,
  productName: string,
  productId: string
}> = ({ modalType, setModalType, productName, productId }) => {
  const [openModal, setOpenModal] = useState(true)

  useEffect(() => {
    if(!openModal) setModalType('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal])

  useEffect(() => {
    if(modalType) setOpenModal(true)

  }, [modalType])

  switch(modalType) {
    case 'delete':
      return <DeleteProductModal
        productId={productId}
        productName={productName} 
        openModal={openModal} 
        setOpenModal={setOpenModal}
      />

    case 'upload':
      return <UploadImgCoverModal
        productId={productId}
        setOpenModal={setOpenModal} 
        openModal={openModal}
      />
    
    default: return null
  }
}

export default ModalList