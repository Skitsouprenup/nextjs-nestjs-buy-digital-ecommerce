import { ResponsePayload, requestMethods } from "./api"

export const productEndpoints = {
  getProducts: async (): 
    Promise<ResponsePayload> => await requestMethods.get('/products'),
  createProduct: async (payload: Record<string, unknown>, headers: Record<string, unknown>): 
    Promise<ResponsePayload> => await requestMethods.post('/products', payload, headers),
  updateProduct: async (
    id: string, 
    payload: Record<string, unknown>, 
    headers: Record<string, unknown>
  ): 
    Promise<ResponsePayload> => 
      await requestMethods.post(`/products/${id}`, payload, headers),
  deleteProduct: async (id: string, headers: Record<string, unknown>): 
    Promise<ResponsePayload> => await requestMethods.del(`/products/${id}`, headers),
  uploadProductImageCover: async (
    id: string, 
    image: File, 
    headers: Record<string, unknown>
  ): Promise<ResponsePayload> => {
    const formData = new FormData()
    formData.append('productimage', image)

    return await requestMethods.post(`/products/${id}/image`, formData, headers)
  },
  updateSku: async (
    productId: string,
    skuId: string,
    payload: Record<string, unknown>,
    headers: Record<string, unknown>,
  ) => await requestMethods.put(`/products/${productId}/sku/${skuId}`, payload, headers),
  createSku: async (
    productId: string,
    payload: unknown,
    headers: Record<string, unknown>,
  ) => await requestMethods.post(`/products/sku/${productId}`, payload, headers),
  deleteSku: async(
    productId: string,
    skuId: string,
    headers: Record<string, unknown>,
  ) => await requestMethods.del(`/products/${productId}/sku/${skuId}`, headers),
  updateLicenseKey: async(
    productId: string,
    skuId: string,
    licenseId: string,
    payload: unknown,
    headers: Record<string, unknown>,
  ) => await requestMethods.put(
    `/products/${productId}/sku/${skuId}/license/${licenseId}`,
    payload,
    headers
  ),
  deleteLicense: async(
    licenseId: string,
    headers: Record<string, unknown>,
  ) => await requestMethods.del(`/products/license/${licenseId}`, headers),
  addLicense: async(
    productId: string,
    skuId: string,
    payload: unknown,
    headers: Record<string, unknown>,
  ) => await requestMethods.post(
    `/products/${productId}/sku/${skuId}/license`,
    payload,
    headers
  ),
  getProductLicense: async(
    productId: string,
    skuId: string,
    isSold: boolean,
    headers: Record<string, unknown>,
  ) => await requestMethods.get(
    `/products/${productId}/sku/${skuId}/license?isSold=${isSold}`,
    headers
  )
}