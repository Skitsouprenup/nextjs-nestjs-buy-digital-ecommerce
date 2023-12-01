import { ProductItemPayload } from "@/types/crud_payload/products/productspayload"
import { FC } from "react"

import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ProductItemContent from "./productitem/ProductItemContent"

const ProductItems:FC<{
  products: Array<Record<string,unknown>> | Array<ProductItemPayload>,
  type: 'LATEST' | 'TOP_RATED' | 'ALL'
}> = ({ products, type }) => {

  let productsToBeDisplayed: 
    Array<ProductItemPayload> | null = null

  if(type === 'ALL') {
    productsToBeDisplayed = 
      products as Array<ProductItemPayload>
  }
  else {
    for(const item of products as Array<Record<string,unknown>>) {
      if(type === 'LATEST') {
        productsToBeDisplayed = 
          item?.latestProducts as Array<ProductItemPayload>
        break;
      }
  
      if(type === 'TOP_RATED') {
        productsToBeDisplayed = 
          item?.topRatedProducts as Array<ProductItemPayload>
        break;
      }
    }
  }

  return (
    <>
      {
        productsToBeDisplayed ?
          productsToBeDisplayed.map((item, index) => {
            return (
              <Col key={item?._id ? item._id : index}>
                <Card className="h-100">
                  <ProductItemContent item={item}/>
                </Card>
              </Col>
            )
          }) : null
      }
    </>
  )
}

export default ProductItems