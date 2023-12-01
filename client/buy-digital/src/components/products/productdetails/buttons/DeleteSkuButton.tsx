"use client"

import { RootContext } from 'context'

import DeleteSkuModal from "@/components/shared/modals/DeleteSkuModal"
import { productEndpoints } from "@/services/product.service"
import { ProductSkuDetails } from "@/types/crud_payload/products/productspayload"
import { FC, useContext, useState } from "react"
import { Trash2 } from "react-bootstrap-icons"
import Button from "react-bootstrap/Button"

import { showAppToast } from '@/utilities/apptoastutils'
import { expiredToken } from "@/utilities/verificationutils"

import { useRouter } from 'next/navigation'

const DeleteSkuButton:FC<{
  skuDetails: Array<ProductSkuDetails>,
  skuId: string,
  setSkuDetails: React.Dispatch<React.SetStateAction<Array<ProductSkuDetails>>>
  productId: string,
  skuName: string
}> = ({ skuDetails, skuId, skuName, productId, setSkuDetails }) => {
  const router = useRouter()
  const rootContext = useContext(RootContext)
  const[openModal, setOpenModal] = useState<boolean>(false)
  const[loading, setLoading] = useState<boolean>(false)

  const deleteProductSku = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user') as string)

    if(!userInfo) {
      showAppToast(
        rootContext, 
        "Incomplete login credentials. Please login again."
      )
      router.push('/login')

      return
    }

    try {
      setLoading(true)

      const newSkuDetails = 
        skuDetails.filter((item) => item._id !== skuId)

      const { success, message } = 
        await productEndpoints.
          deleteSku(
            productId, 
            skuId,
            {
              headers: {
                "Authorization": `Bearer ${userInfo?.token}`
              }
            }
          )

      if(success) {
        showAppToast(rootContext, message)
        setSkuDetails([...newSkuDetails])

        /*
          Reload the page so that the sku badges near product title
          will update as well
        */
        location.reload()
      }
    }
    catch(error) {
      console.error(error)

      const errorData = error as 
        { response: { data: { exception: Record<string, unknown> } }}

      if(!expiredToken(
        errorData.response.data.exception?.name as string,
        rootContext
      )) showAppToast(rootContext, 'Something went wrong!')
    }
    finally {
      setLoading(false)
    }

  }

  return (
    <>
      <Button 
        variant="danger"
        onClick={() => setOpenModal(true)}
      >
        <Trash2 />
      </Button>

      <DeleteSkuModal 
        deleteSku={deleteProductSku}
        openModal={openModal}
        setOpenModal={setOpenModal}
        loading={loading}
        skuName={skuName}
      />
    </>
  )
}

export default DeleteSkuButton