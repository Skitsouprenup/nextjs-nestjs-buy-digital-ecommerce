import { FC } from "react"

import ProductRating from "../productitem/ProductRating"
import { 
  ProductItemPayload, 
  ProductSkuDetails 
} from "@/types/crud_payload/products/productspayload"

import ProductSkusContent from "./tabcontent/ProductSkusContent"
import ProductDetailsTabs from "./ProductDetailsTabs"
import CustomTabContent from "@/components/CustomTabContent"
import DescriptionContent from "./tabcontent/DescriptionContent"
import RequirementsContent from "./tabcontent/RequirementsContent"
import ReviewsContent from "./tabcontent/ReviewsContent"

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import ProductItemContent from "../productitem/ProductItemContent"
import ProductDetailsSku from "./ProductDetailsSku"

const ProductDetailsPage:FC<{
fetchContent: Record<string, unknown> | null
}> = ({ fetchContent }) => {
  const product = fetchContent?.product as Record<string, unknown>
  const relatedProducts = fetchContent?.relatedProducts as Array<Record<string, unknown>>
  const highlights = product?.highlights as Array<string>
  const skuDetails = product?.skuDetails as Array<ProductSkuDetails>
  const feedbacks = product?.feedbacks as Array<Record<string, unknown>>

  return (
    <>
      <Row xs="1" md="2">
        <Col>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="product" 
            src={product?.image as string} 
            className="w-100 h-100"
          />
        </Col>

        <Col>
          <h5>{product?.productName as string}</h5>
          
          <div 
            className="d-flex align-items-center flex-wrap"
            style={{ marginBottom: '5px' }}
          >
            <ProductRating ratingAvg={product?.ratingAvg as number}/>
            <div className="position-relative" style={{top: '2px'}}>
              ({feedbacks.length} {
                feedbacks.length === 0 || feedbacks.length === 1 ? 
                'Review' : 'Reviews'
              })
            </div>
          </div>

          {/* Highlights */}
          {
            highlights.length ? (
              <div className="d-flex flex-column gap-2">
                {
                  highlights.map((item, index) => { 
                    return <h6 key={`${item}-${index}`}>{item}</h6> 
                  })
                }
              </div>
            ) : null
          }

          {/* Available SKUs, textfield and button */}
          {
            skuDetails.length > 0 ? (
              <ProductDetailsSku 
                skuDetails={skuDetails}
                product={product}
              />
            ) : <h5>Product Unavailable.</h5>
          }
        </Col>
      </Row>

      {/* spacing */}
      <div style={{padding: '10px'}}></div>

      <ProductDetailsTabs>
        <CustomTabContent tabKey="first">
          <DescriptionContent description={product?.description as string}/>
        </CustomTabContent>

        <CustomTabContent tabKey="second">
          <RequirementsContent 
            requirements={product?.specification as Array<Record<string, unknown>>}
          />
        </CustomTabContent>

        <CustomTabContent tabKey="third">
          <ReviewsContent 
            feedbacks={feedbacks}
            productId={product?._id as string}
          />
        </CustomTabContent>

        {/* CustomTabContent is inside of this component */}
        <ProductSkusContent
          skuDetails={skuDetails} 
          productId={product?._id as string}
        />
        
      </ProductDetailsTabs>

      <hr />

      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-center">
          <h5>Related Products</h5>
        </div>

        <Row>
          {
            relatedProducts.map((item) => {
              const product = item as unknown

              return (
                <Col xs="6" md="4" lg="3" key={item?._id as string}>
                  <Card className="h-100">
                    <ProductItemContent item={product as ProductItemPayload} />
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </div>
    </>
  )
}

export default ProductDetailsPage