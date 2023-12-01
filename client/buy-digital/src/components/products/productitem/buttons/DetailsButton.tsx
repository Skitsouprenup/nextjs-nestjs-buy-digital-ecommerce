'use client'

import Button from 'react-bootstrap/Button'

import { Eye } from 'react-bootstrap-icons'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FC } from 'react'

import { useRouter } from 'next/navigation'

const DetailsButton:FC<{
  productId: string
}> = ({ productId }) => {
  const router = useRouter()

  const renderTooltip = (props: Record<string, unknown>) => (
    <Tooltip id="button-tooltip" {...props}>
      View Product
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
          onClick={() => router.push(`/products/${productId}`)}
        >
          <Eye />
        </Button>
      </OverlayTrigger>
    </div>
  )
}

export default DetailsButton