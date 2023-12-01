import ProductFormContent from '@/components/products/productform/ProductFormContent'
import RootPage from '@/components/shared/RootPage'

export default async function CreateProductPage() {

  return (
    <RootPage>
      <ProductFormContent product={null}/>
    </RootPage>
  )
}