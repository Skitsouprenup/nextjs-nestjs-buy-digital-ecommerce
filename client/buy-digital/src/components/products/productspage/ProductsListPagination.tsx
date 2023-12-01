'use client'

import { FC, useState } from "react"
import { useRouter } from 'next/navigation'

import Pagination from 'react-bootstrap/Pagination'

const ProductsListPagination:FC<{
  metadata: Record<string, unknown>
}> = ({ metadata }) => {
  const router = useRouter()
  const [links] = 
    useState<Record<string,string>>(metadata?.links as Record<string, string>)
  const [limit] = useState<number>(metadata?.limit as number)
  const [productCount] = useState<number>(metadata?.productCount as number)

  return (
    <>
      <span className="d-flex align-items-center me-2">
        Showing {' '} 
        {limit > productCount ? productCount : limit} 
        {' '} of {' '}
        {productCount} {' '} results
      </span>

      <div>
        <Pagination className="my-auto">

          <Pagination.First 
            disabled={links?.first ? false : true}
            onClick={() => router.push(`/products${links?.first}`)}
          />
          <Pagination.Prev 
            disabled={links?.prev ? false : true}
            onClick={() => router.push(`/products${links?.prev}`)}
          />

          <Pagination.Next 
            disabled={links?.next ? false : true}
            onClick={() => router.push(`/products${links?.next}`)}
          />
          <Pagination.Last 
            disabled={links?.last ? false : true}
            onClick={() => router.push(`/products${links?.last}`)}
          />

        </Pagination>
      </div>
    </>
  )
}

export default ProductsListPagination