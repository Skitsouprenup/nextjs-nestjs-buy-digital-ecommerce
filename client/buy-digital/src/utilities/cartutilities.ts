import { convertCentsToUsd } from "./utilities"

export const computeTotalPriceInCart = (
  cartItems: Array<Record<string, unknown>>
) => {
  if(cartItems.length <= 0) return 0

    return cartItems.map((item) => {
      const productInfo = 
        item?.productInfo as Record<string, unknown>
      const price = productInfo?.price as number
      const quantity = item?.quantity as number

      return convertCentsToUsd(price) * quantity
    }).reduce((prev, current) => prev + current)
}