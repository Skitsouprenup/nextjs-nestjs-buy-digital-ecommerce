import 'server-only'

import { headers } from 'next/headers'

export const fetchProduct = async (id: string) => {
  try {
    const requestHeaders = {
      'Content-Type': 'application/json'
    }

    return await 
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + 
      `/products/${id}`, 
      { 
        cache: 'no-cache', 
        method: 'GET', 
        headers: requestHeaders
      }
    ).
    then((response) => response.json())
  }
  catch(error) {
    console.log(error)
  }
}

export const fetchProducts = async (url: string) => {
  try {
    const requestHeaders = {
      'Content-Type': 'application/json'
    }

    return await 
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + 
      url, 
      { 
        cache: 'no-cache', 
        method: 'GET', 
        headers: requestHeaders
      }
    ).
    then((response) => response.json())
  }
  catch(error) {
    console.log(error)
  }
}

export const fetchProductPageProducts = async () => {
  const headersList = headers()
  const queryString = headersList.get('query-string')
  const url = queryString ? `/products?${queryString}` : '/products'

  try {
    const requestHeaders = {
      'Content-Type': 'application/json'
    }

    return await 
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + 
      url, 
      { 
        cache: 'no-cache', 
        method: 'GET', 
        headers: requestHeaders
      }
    ).
    then((response) => response.json())
  }
  catch(error) {
    console.log(error)
  }
}