"use client"

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from "react-bootstrap/Button"

import { Pen } from 'react-bootstrap-icons'

import { useRouter } from 'next/navigation'
import { FC } from 'react'

const EditButton:FC<{
  productId: string
}> = ({ productId }) => {
  const router = useRouter()

  const renderTooltip = (props: Record<string, unknown>) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit Product
    </Tooltip>
  );

  return (
    <div>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 300 }}
        overlay={renderTooltip}
      >
        <Button 
          className={`
            btn btn-outline-dark btn-light 
            d-flex align-items-center gap-1 p-1
          `}
          onClick={() => router.push(`/products/update/${productId}`)}
        >
          <Pen />
        </Button>
      </OverlayTrigger>
    </div>
  )
}

export default EditButton