
export interface ProductItemPayload {
  _id: string
  productName: string
  description: string
  image: string
  category: string
  platformType: string
  deviceType: string
  productUrl: string
  downloadUrl: string
  specification: Array<ProductSpecification>
  highlights: Array<String>
  imageDetails: { url: string }
  skuDetails: Array<ProductSkuDetails>
  feedbacks: Array<Record<string, unknown>>
  ratingAvg: number
}

export interface ProductSpecification {
  "RAM": string
  "Processor": string
  "Storage": string
}

export interface ProductSkuDetails {
  _id: string
  name: string
  price: number
  validityInDays: number
  lifetime: boolean
  stripePriceId: string
  skuCode: string
}