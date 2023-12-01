import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumbs from '@/components/shared/Breadcrumbs'

import SortSelection from '@/components/products/productspage/SortSelection'
import ProductsFilter from '@/components/products/productspage/ProductsFilter'
import ProductItem from '@/components/products/ProductItems'
import ProductsListPagination from '@/components/products/productspage/ProductsListPagination'
import CreateProductButton from '@/components/products/productspage/CreateProductButton'
import { fetchProductPageProducts } from '@/crudoperations/serveronly/productfetching'
import RootPage from '@/components/shared/RootPage'

export default async function ProductsPage() {
  const products = await fetchProductPageProducts() as Record<string, unknown>

  if(!products) return <h3>Can&apos;t fetch products.</h3>

  const fetchContent = products?.content as Record<string, unknown>

  const breadcrumbsPaths = [
    {
      active: false,
      href: '/',
      text: 'Home'
    },
    {
      active: false,
      href: '/products',
      text: 'Products'
    }
  ]

  return (
    <RootPage>
      <Row>
        <Col xs={6}>
          <Breadcrumbs paths={breadcrumbsPaths} />
        </Col>

        <Col xs={6} className='d-flex justify-content-end align-items-center'>
          <div className='d-flex gap-2 w-100 justify-content-end'>
            <CreateProductButton />
            <SortSelection />
          </div>
        </Col>
      </Row>

      <Row className='mt-2'>
        <Col sm={3}>
          <ProductsFilter />
        </Col>
        <Col sm={9}>
          <Row xs={1} md={2} lg={3} className='gap-2'>
            <ProductItem 
              products={fetchContent?.products as Array<Record<string, unknown>>}
              type='ALL'
            />
          </Row>
        </Col>
      </Row>

      <Row className='mt-2'>
        <Col className='d-flex justify-content-end'>
          <ProductsListPagination 
            metadata={fetchContent?.metadata as Record<string,unknown>}
          />
        </Col>
      </Row>

    </RootPage>
  )
}