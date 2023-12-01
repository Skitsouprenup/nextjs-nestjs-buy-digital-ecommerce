"use client"

import { Dispatch, FC, SetStateAction, useContext, useState } from "react"

import { RootContext } from "context"

import { useRouter } from "next/navigation"

import Offcanvas from "react-bootstrap/Offcanvas"
import OffcanvasHeader from "react-bootstrap/OffcanvasHeader"
import OffcanvasTitle from "react-bootstrap/OffcanvasTitle"
import OffcanvasBody from "react-bootstrap/OffcanvasBody"
import CartItems from "./CartItems"
import { ordersEndpoints } from "@/services/orders.service"
import { getUserInfoInLocalStorage, tokenExpiredOrSomethingElse } from "@/utilities/utilities"

interface CardSidebarProps {
  show: boolean,
  setShow: Dispatch<SetStateAction<boolean>>
}

const CartOffcanvas:FC<CardSidebarProps> = ({ show, setShow }) => {
  const rootContext = useContext(RootContext)
  const router = useRouter()

  const { cartItems, cartDispatch } = rootContext
  const [loading, setLoading] = useState<boolean>(false)

  const handleCheckout = async () => {
    const userInfo = 
        getUserInfoInLocalStorage(rootContext, router)

    try {
      setLoading(true)

      const headers = {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${userInfo?.token}`
        }
      }

      const { success, message ,content } =
      await ordersEndpoints.checkoutSession(
        cartItems as Record<string, unknown>, 
        headers
      )

      if(success) {
        const sessionUrl = content as { url: string }
        router.push(sessionUrl.url as string)
      }
    }
    catch(error) {
      console.error(error)
      tokenExpiredOrSomethingElse(error, rootContext)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Offcanvas 
        show={show} 
        onHide={() => setShow(false)}
        placement="end"
      >
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>Shopping Cart</OffcanvasTitle>
        </OffcanvasHeader>

        <OffcanvasBody>
          <CartItems 
            cartItems={cartItems as Array<Record<string, unknown>>} 
            cartDispatch={cartDispatch}
            setShow={setShow}
            handleCheckout={handleCheckout}
          />
        </OffcanvasBody>
      </Offcanvas>
    </>
  )
}

export default CartOffcanvas