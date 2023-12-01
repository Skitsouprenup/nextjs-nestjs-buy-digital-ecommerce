"use client"

import { FC, useState } from "react"
import DeleteButton from "./buttons/DeleteButton"
import DetailsButton from "./buttons/DetailsButton"
import EditButton from "./buttons/EditButton"
import UploadButton from "./buttons/UploadButton"
import ModalList from "./ModalList"

const ItemButtonsBottom:
FC<{
  productName: string,
  productId: string
}> = ({ productName, productId }) => {
  const [modalType, setModalType] = useState('')

  return (
    <>
      <div className='d-flex pt-2 gap-2 justify-content-between flex-wrap'>
        <UploadButton setModalType={setModalType}/>
        <DeleteButton setModalType={setModalType}/>
        <EditButton productId={productId} />
        <DetailsButton productId={productId}/>
      </div>

      <ModalList
        productId={productId}
        modalType={modalType} 
        setModalType={setModalType} 
        productName={productName}
      />
    </>
  )
}

export default ItemButtonsBottom