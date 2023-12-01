"use client"

import Button from "react-bootstrap/Button"
import { Cart } from "react-bootstrap-icons"

import { RootContext } from "context"
import { FC, useContext, Dispatch, SetStateAction, useState, ChangeEvent } from "react"
import { ProductSkuDetails } from "@/types/crud_payload/products/productspayload"
import { showAppToast } from "@/utilities/apptoastutils"

const QuantityBuySection:FC<{
  selectedSku: ProductSkuDetails | undefined,
  product: Record<string, unknown>
}> = ({ selectedSku, product }) => {
  const rootContext = useContext(RootContext)
  const cartItems = rootContext.cartItems as Array<Record<string, unknown>>

  const[quantity, setQuantity] = useState<number>(0)

  const setProductQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.target as HTMLInputElement
    try {
      const productQuantity = Number(element.value)
      setQuantity(productQuantity)
    } catch(error) {
      //console.error(error)
      setQuantity(0)
    }
  }

  const addItemToCart = () => {
    if(quantity <= 0) {
      showAppToast(rootContext, "Quantity should be at least 1")
      return
    }

    let existingInCart = false
    let payload: Record<string, unknown> = { }

    for(const item of cartItems) {
      const itemId = item?.skuId as string
      const itemQty = item?.quantity as number

      if(itemId === selectedSku?._id) {

        payload = { ...item }
        payload['quantity'] = quantity + itemQty

        existingInCart = true
        break        
      }
    }

    if(existingInCart) {
      rootContext.cartDispatch({
        type: 'UPDATE_ITEM_ON_CART',
        payload
      })

      showAppToast(
        rootContext, 
        'Item in cart has been updated.'
      )
    }
    else {

      payload['quantity'] = quantity
      payload['skuPriceId'] = selectedSku?.stripePriceId
      payload['skuId'] = selectedSku?._id
      payload['productInfo'] = {
        productImageUrl: product?.image,
        productName: product?.productName,
        price: selectedSku?.price,
        lifetime: selectedSku?.lifetime,
        validityInDays: selectedSku?.validityInDays
      }

      rootContext.cartDispatch({
        type: 'ADD_ITEM_TO_CART',
        payload
      })

      showAppToast(
        rootContext, 
        'Item has been added to the cart.'
      )
    }
  }

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex gap-2">
        Qty: <input
                value={quantity}
                onChange={(e) => setProductQuantity(e)}
                type="number" 
                style={{width: '95px'}} 
              />
      </div>

      <Button
        onClick={addItemToCart}
        style={{ width: 'fit-content'}}
      >
        <Cart /> Add To Cart
      </Button>
    </div>
  )
}

export default QuantityBuySection