import { FC } from "react"

const ProductsList:FC<{
  products: Array<Record<string,unknown>>
}> = ({ products }) => {
  console.log(products)
  return (
    <>
      
    </>
  )
}

export default ProductsList