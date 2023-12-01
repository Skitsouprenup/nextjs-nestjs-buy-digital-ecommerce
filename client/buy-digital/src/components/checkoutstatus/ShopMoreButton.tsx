"use client"

import { RootContext } from "context"
import Link from "next/link"
import { FC, useContext, useEffect } from "react"

import Button from "react-bootstrap/Button"

const ShopMoreButton:FC<{
  success?: boolean
}> = ({ success = false }) => {
  const rootContext = useContext(RootContext)
  const { cartDispatch } = rootContext

  useEffect(() => {
    if(success) {
      cartDispatch({
        type: 'CLEAR_CART',
        payload: []
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Link href={'/products'}>
        <Button variant="primary">
          Shop More
        </Button>
      </Link>
    </>
  )
}

export default ShopMoreButton