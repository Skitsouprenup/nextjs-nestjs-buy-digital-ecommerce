import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ViewMoreButton from './ViewMoreButton'
import ProductItems from '../products/ProductItems'
import { fetchProducts } from '@/crudoperations/serveronly/productfetching'

const HomePageContent = async () => {
  const products = await fetchProducts('/products?homepage=true') as Record<string, unknown>

  if(!products) return <h3>Can&apos;t fetch products.</h3>

  return (
    <div className='d-flex flex-column gap-3'>
      <div className='d-flex flex-column gap-2'>
        <h3>Latest Products</h3>
        <Row xs="1" sm="2" md="3" lg="4">
          <ProductItems 
            products={products?.content as Array<Record<string, unknown>>} 
            type='LATEST'
          />
        </Row>
      </div>
      
      <hr style={{margin: '0'}}/>

      <div className='d-flex flex-column gap-2'>
        <h3>Top-Rated Products</h3>
        <Row xs="1" sm="2" md="3" lg="4">
          <ProductItems 
            products={products?.content as Array<Record<string, unknown>>}  
            type='TOP_RATED'
          />
        </Row>
      </div>

      <div className='d-flex justify-content-end'>
        <ViewMoreButton />
      </div>
    </div>
  )
}

export default HomePageContent