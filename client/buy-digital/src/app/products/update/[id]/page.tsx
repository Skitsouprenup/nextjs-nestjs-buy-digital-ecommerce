import ProductFormContent from '@/components/products/productform/ProductFormContent'
import RootPage from '@/components/shared/RootPage'
import { fetchProduct } from '@/crudoperations/serveronly/productfetching'

export default async function UpdateProductPage({ params } : { params: { id: string } }) {
  const product = await fetchProduct(params.id)

  if(!product) return <h3>Can&apos;t fetch products.</h3>

  const fetchContent = product?.content as Record<string, unknown>
  const fetchedProduct = fetchContent?.product as Record<string, unknown>

  return (
    <RootPage>
      <ProductFormContent product={fetchedProduct}/>
    </RootPage>
  )
}