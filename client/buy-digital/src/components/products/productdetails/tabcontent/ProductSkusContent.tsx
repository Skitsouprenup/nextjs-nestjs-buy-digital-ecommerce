"use client"

import { FC, useEffect, useState } from "react"
import ProductSkuPage from "./sku/ProductSkuPage";
import { ProductSkuDetails } from "@/types/crud_payload/products/productspayload";
import ProductSkuForm from "./sku/ProductSkuForm";
import CustomTabContent from "@/components/CustomTabContent";
import SkuLicensePage from "./sku/license/SkuLicensePage";

const ProductSkusContent:FC<{
  skuDetails: Array<ProductSkuDetails>,
  productId: string
}> = ({ skuDetails, productId }) => {
  const[skuList, setSkuList] = useState<Array<ProductSkuDetails>>(skuDetails)
  const[showContent, setShowContent] = useState<boolean>(false)

  const [skuMode, setSkuMode] = 
    useState<{ mode: string, skuId: string }>({ mode: '', skuId: '' })

  useEffect(() => {
    const userInfo: Record<string, unknown> = 
      JSON.parse(localStorage.getItem('user') as string)
    const user = userInfo?.user as Record<string, unknown>
    const role = user?.role as string

    if(role === 'admin') setShowContent(true)
  }, [])

  const SkuContentSelection = () => {

    switch(skuMode.mode) {
      case 'Add':
        <ProductSkuForm 
          productId={productId}
          skuList={skuList}
          setSkuList={setSkuList}
          setSkuMode={setSkuMode}
        />

      case 'Edit':
        return <ProductSkuForm 
          productId={productId}
          skuList={skuList}
          skuId={skuMode.skuId}
          setSkuList={setSkuList}
          setSkuMode={setSkuMode}
        />

      case 'License':
        return <SkuLicensePage
          productId={productId}
          skuId={skuMode.skuId}
          setSkuMode={setSkuMode}
        />

      default:
        return <ProductSkuPage 
          setSkuMode={setSkuMode}
          skuDetails={skuList}
          setSkuDetails={setSkuList}
          productId={productId}
        />
    }
  }

  return (
    <>
      {
        showContent ? (
          <CustomTabContent tabKey="fourth">
            <SkuContentSelection />
          </CustomTabContent>
        ) : null
      }
    </>
  )
}

export default ProductSkusContent