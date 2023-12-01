import { ResponsePayload, requestMethods } from "./api"

export const ordersEndpoints = {
  checkoutSession: async (
    cartItems: Record<string, unknown>,
    headers: Record<string, unknown>
  ): Promise<ResponsePayload> => 
    await requestMethods.post(
      '/orders/checkout', 
      { checkoutDetails: cartItems }, 
      headers
    ),
  fetchOrdersOfUser: async (headers: Record<string, unknown>, status: string | null) => {
    let url = '/orders'
    if(status)
      url = `/orders/?status=${status}`

    return await requestMethods.get(
      url,
      headers
    )
  },
  fetchOrder: async(orderId: string, headers: Record<string, unknown>) =>
    await requestMethods.get(`/orders/${orderId}`, headers)
}