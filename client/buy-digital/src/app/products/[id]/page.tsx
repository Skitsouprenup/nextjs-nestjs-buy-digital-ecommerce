import ProductDetailsPage from "@/components/products/productdetails/ProductDetailsPage"
import RootPage from "@/components/shared/RootPage"
import { fetchProduct } from "@/crudoperations/serveronly/productfetching"

export default async function ProductPage({ params } : { params: { id: string } }) {
  const product = await fetchProduct(params.id) as Record<string, unknown>

  if(!product) return <h3>Can&apos;t fetch products.</h3>

  const fetchContent = product?.content as Record<string, unknown>

  return (
    <RootPage>
      <ProductDetailsPage 
        fetchContent={fetchContent as Record<string, unknown>}
      />
    </RootPage>
  )
}