"use client"

import { ProductSkuDetails } from "@/types/crud_payload/products/productspayload"
import { FC } from "react"
import { Badge } from "react-bootstrap"
import { Pen } from "react-bootstrap-icons"
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"
import DeleteSkuButton from "../../buttons/DeleteSkuButton"
import { convertCentsToUsd } from "@/utilities/utilities"

const ProductSkuPage:FC<{
  setSkuMode: Function,
  skuDetails: Array<ProductSkuDetails>,
  setSkuDetails: React.Dispatch<React.SetStateAction<Array<ProductSkuDetails>>>,
  productId: string,
}> = ({ setSkuMode, skuDetails, productId, setSkuDetails }) => {

  if(skuDetails.length === 0) {
    return <h4>No Product SKUs Found.</h4>
  }

  return (
    <div>
      <Button 
        variant="secondary"
        onClick={() => setSkuMode({ mode: 'Add', skuId: '' })}
      >
        Add SKU Details
      </Button>

      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>License Keys</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {
            skuDetails.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.name}
                </td>
                <td>
                  ${`${convertCentsToUsd(item.price)} `}
                  <Badge bg='warning' text='dark'>
                    {item.lifetime ? 'Lifetime' : `${item.validityInDays} Days`}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="link"
                    onClick={() => setSkuMode({ mode: 'License', skuId: item._id })}
                  >
                    View
                  </Button>
                </td>
                <td className="d-flex gap-2 align-items-center">
                  <Button 
                    variant="secondary"
                    onClick={() => setSkuMode({ mode: 'Edit', skuId: item._id })}
                  >
                    <Pen />
                  </Button>

                  <DeleteSkuButton 
                    skuDetails={skuDetails}
                    setSkuDetails={setSkuDetails}
                    skuId={item._id}
                    skuName={item.name}
                    productId={productId}
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  )
}

export default ProductSkuPage