"use client"

import Link from "next/link"
import { Dispatch, FC, SetStateAction } from "react"

import Badge from "react-bootstrap/Badge"
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"
import { Trash2Fill } from "react-bootstrap-icons"
import { computeTotalPriceInCart } from "@/utilities/cartutilities"
import { convertCentsToUsd } from "@/utilities/utilities"

const CartItems:FC<{
  cartItems: Array<Record<string, unknown>>,
  cartDispatch: (action: { type: string, payload: unknown }) => void,
  setShow: Dispatch<SetStateAction<boolean>>,
  handleCheckout: () => void
}> = ({ cartItems, cartDispatch, setShow, handleCheckout }) => {

  const deleteCartItem = (skuId: string) => {
    cartDispatch({ type: 'REMOVE_ITEM_FROM_CART', payload: { skuId }})
  }

  const getLicenseValidity = (productInfo: Record<string, unknown>) => {
    const validityInDays = productInfo?.validityInDays as string

    if(productInfo?.lifetime)
      return 'Lifetime'
    else return validityInDays + ' Days'
  }

  return (
    <>
      {
        cartItems.length > 0 ? (
          <div
            className={
              `d-flex flex-column gap-2`
            }
          >
            {
              cartItems.map((item) => {
                const productInfo = 
                  item?.productInfo as Record<string, unknown>
                const price = productInfo?.price as number
                const quantity = item?.quantity as number

                return (
                  <div
                    className="d-flex gap-1" 
                    key={item?.skuId as string}
                  >
                    <Image  
                      alt="product" 
                      src={productInfo?.productImageUrl as string}
                      style={{
                        width: '25px',
                        height: '25px',
                      }}
                      roundedCircle
                    />
                    
                    <div className="d-flex flex-column">
                      <span>
                        {productInfo?.productName as string}
                      </span>
                      <div 
                        className="d-flex flex-column gap-1"
                        style={{ padding: '5px 0'}}
                      >
                        <span>{`Qty: x${quantity}`}</span>
                        <span>{`Price: $${convertCentsToUsd(price) * quantity}`}</span>
                        <span>
                          Validity:&nbsp;
                          <Badge bg="warning" text="dark">
                            {getLicenseValidity(productInfo)}
                          </Badge>
                        </span>
                        <Button
                          variant="danger"
                          style={{
                            width: '25px',
                            height: '25px'
                          }}
                          onClick={() => deleteCartItem(item?.skuId as string)}
                        >
                          <span
                            style={{
                              position: 'relative',
                              top: '-8px',
                              left: '-7px'
                            }}
                          >
                            <Trash2Fill size={15}/>
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            }

            <div className="d-flex flex-column">
              <div 
                className="display-6"
                style={{
                  fontSize: '1.5rem'
                }}
              >
                <b>Total: ${computeTotalPriceInCart(cartItems)}</b>
              </div>
              <Button 
                variant="success"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column">
            <h4>No Items in Cart</h4>
            <Link
              onClick={() => setShow(false)} 
              href={'/products'}
            >
              <Button
                variant="outline-primary"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        )
      }
    </>
  )
}

export default CartItems