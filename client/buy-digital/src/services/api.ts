import { ProductSkuDetails } from "@/types/crud_payload/products/productspayload"
import axios, { AxiosResponse } from "axios"

export interface ResponsePayload {
  success: boolean
  content: unknown
  message: string
}
const responseBody = (response: AxiosResponse) => response.data

export const requestMethods = {
  get: async (url: string, headers?: Record<string, unknown>) => {
    if(headers) {
      return axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + url, headers).
      then(responseBody)
    }
    else {
      return axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + url).
      then(responseBody)
    }
  },
  post: async (url: string, body: unknown, headers?: Record<string,unknown>) => {
    if(!headers)
      return axios.post(process.env.NEXT_PUBLIC_API_BASE_URL + url, body).then(responseBody)
    else 
      return axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + url, 
        body,
        headers
      ).then(responseBody)
  },
  put: async (url: string, body: unknown, headers?: Record<string, unknown>) => {
    if(!headers)
      return axios.put(process.env.NEXT_PUBLIC_API_BASE_URL + url, body).then(responseBody)
    else 
      return axios.put(
        process.env.NEXT_PUBLIC_API_BASE_URL + url, 
        body, 
        headers
      ).then(responseBody)
  },
  del: async (url: string, headers: Record<string, unknown>) => {
      return axios.delete(
        process.env.NEXT_PUBLIC_API_BASE_URL + url, 
        headers
      ).then(responseBody)
  },
  patch: (url: string) => axios.patch(process.env.NEXT_PUBLIC_API_BASE_URL + url).then(responseBody),
}