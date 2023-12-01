'use client'

import { FC, useContext, useEffect, useState } from 'react'
import { RootContext } from 'context'

import Container from 'react-bootstrap/Container'

import { UserDataPayload } from "@/types/credentialforms/usercredentials"

import { useRouter } from "next/navigation"

const RootPage: FC<{children: React.ReactNode}> = ({ children }) => {
  const router = useRouter()
  const rootContext = useContext(RootContext)
  const [isloggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const cartData = localStorage.getItem('buy_digital_cart')
    if(cartData) {
      const cartInfo = JSON.parse(cartData)

      rootContext.cartDispatch({
        type: 'GET_ITEMS_FROM_LOCALSTORAGE',
        payload: cartInfo
      })
    }

    const userData = localStorage.getItem('user')
    if(userData) {
      const userInfo = JSON.parse(userData) as UserDataPayload

      rootContext.dispatch({
        type: 'LOGIN',
        payload: userInfo.user
      })

      setIsLoggedIn(true)
    }
    else router.push('/login')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>{isloggedIn ? children : null}</Container>
  )
}

export default RootPage