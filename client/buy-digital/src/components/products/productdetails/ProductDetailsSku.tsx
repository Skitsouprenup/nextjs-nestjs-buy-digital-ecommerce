"use client"

import { convertCentsToUsd, sortSkuDetailsByDays } from "@/utilities/utilities"
import QuantityBuySection from "./QuantityBuySection"

import Badge from "react-bootstrap/Badge"
import { FC, useEffect, useState } from "react"
import { ProductSkuDetails } from "@/types/crud_payload/products/productspayload"

const ProductDetailsSku:FC<{
  skuDetails: Array<ProductSkuDetails>,
  product: Record<string, unknown>,
}> = ({ skuDetails, product }) => {
  const[selectedSku, setSelectedSku] = 
  useState<ProductSkuDetails>()

  useEffect(() => {
    if(skuDetails.length > 0) {
      setSelectedSku({ ...skuDetails[0] })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clickToSelectSku = (sku: ProductSkuDetails) => {
    setSelectedSku({ ...sku })
  }

  return (
    <>
      {
        skuDetails.length ? (
          <div className="d-flex flex-column gap-2">

            <div className="d-flex gap-1 flex-wrap">
              {
                sortSkuDetailsByDays(skuDetails).
                map((item) => 
                  <Badge 
                    key={item._id} 
                    bg={item._id === selectedSku?._id ? 'primary' : 'warning'} 
                    text={item._id === selectedSku?._id ? 'light' : 'dark'} 
                    onClick={() => clickToSelectSku(item)}
                    style={{ cursor: 'pointer'}}
                  >
                    {item.lifetime ? 'Lifetime' : `${item.validityInDays} Days`}
                  </Badge>
                )
              }
            </div>

            <div className="d-flex gap-1 align-items-center flex-wrap">
              <span>Buy</span> 
              <span>Single</span>
              <Badge style={{height: 'fit-content'}}>
                {
                  selectedSku?.lifetime ? 
                  'Lifetime' : 
                  `${selectedSku?.validityInDays} Days`
                }
              </Badge> License for 
              <b>
                {`$${convertCentsToUsd(selectedSku?.price as number)}`}
              </b>
            </div>

            {/* Textfield and button */}
            <QuantityBuySection 
              selectedSku={selectedSku} 
              product={product}
            />
          </div>
        ) : null
      }
    </>
  )
}

export default ProductDetailsSku