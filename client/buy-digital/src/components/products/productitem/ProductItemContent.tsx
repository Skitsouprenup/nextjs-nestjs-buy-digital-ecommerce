import { ProductItemPayload, ProductSkuDetails } from '@/types/crud_payload/products/productspayload'
import { FC } from 'react'

import Badge from 'react-bootstrap/Badge'
import CardImg from 'react-bootstrap/CardImg'
import CardBody from 'react-bootstrap/CardBody'
import CardTitle from 'react-bootstrap/CardTitle'
import CardText from 'react-bootstrap/CardText'

import ProductRating from './ProductRating'
import ItemButtonsBottom from './ItemButtonsBottom'
import { convertCentsToUsd, sortSkuDetailsByDays } from '@/utilities/utilities'

const ProductItemContent: FC<{
  item: ProductItemPayload
}> = ({ item }) => {

  const findMinMaxPrice = (priceList: Array<ProductSkuDetails>) => {
    if(!priceList.length) return 'Unknown'

    if(priceList.length > 1) { 
      const min = Math.min.apply(null, priceList.map((item) => item.price))
      const max = Math.max.apply(null, priceList.map((item) => item.price))

      return `$${convertCentsToUsd(min)}-$${convertCentsToUsd(max)}`
    }

    if(priceList.length === 1) return `$${priceList[0].price}` 
  }

  

  return (
    <>
      <CardImg variant="top" src={item?.image} style={{ height: '150px'}}/>
      <CardBody>
        <div className='d-flex flex-column gap-1 h-100'>
          <div 
            style={{
              flex: 1,
            }}
            className='d-flex flex-column gap-1'
          >
            <CardTitle style={{flex: 1}}>
              {item.productName}
            </CardTitle>

            <div style={{flex: 1}}>
              <ProductRating ratingAvg={item.ratingAvg}/>
            </div>

            <CardText style={{flex: 1}}>
              <span>{findMinMaxPrice(item.skuDetails)}</span>
            </CardText>
            <div className='d-flex gap-1 flex-wrap'>
              {
                item.skuDetails.length ?
                  sortSkuDetailsByDays(item.skuDetails).
                    map((item) => 
                      <Badge key={item._id} bg='warning' text='dark'>
                        {item.lifetime ? 'Lifetime' : `${item.validityInDays} Days`}
                      </Badge>) : null
              }
            </div>
          </div>
          
          <div>
            <ItemButtonsBottom 
              productName={item.productName} 
              productId={item._id} 
            />
          </div>
        </div>
      </CardBody>
    </>
  )
}

export default ProductItemContent