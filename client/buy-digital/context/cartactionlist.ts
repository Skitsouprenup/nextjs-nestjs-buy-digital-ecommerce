
const cartActions = [
  {
    name: 'ADD_ITEM_TO_CART',
    action: (state: unknown, value: unknown) => {
      const currentCartItems = state as Array<Record<string, unknown>>
      const cartItems = [...currentCartItems, value]
      localStorage.setItem('buy_digital_cart', JSON.stringify(cartItems))
      return cartItems
    } 
  },
  {
    name: 'REMOVE_ITEM_FROM_CART',
    action: (state: unknown, value: unknown) => {
      const payload = value as Record<string, unknown>
      const cartItems = state as Array<Record<string, unknown>>

      const newCartItems = cartItems.filter((item) => item?.skuId !== payload?.skuId)
      localStorage.setItem('buy_digital_cart', JSON.stringify(newCartItems))
      return newCartItems
    }
  },
  {
    name: 'UPDATE_ITEM_ON_CART',
    action: (state: unknown, value: unknown) => {
      const payload = value as Record<string, unknown>
      const cartItems = state as Array<Record<string, unknown>>

      const updatedCartItems = cartItems.map((item) => {
        if(item?.skuId === payload?.skuId) {
          return payload
        }

        return item
      })
      localStorage.setItem('buy_digital_cart', JSON.stringify(updatedCartItems))
      return updatedCartItems
    }
  },
  {
    name: 'GET_ITEMS_FROM_LOCALSTORAGE',
    action: (state: unknown, value: unknown) => {
      return value
    }
  },
  {
    name: 'CLEAR_CART',
    /*eslint-disable-next-line no-unused-vars*/
    action: (state: unknown, value: unknown) => {
      localStorage.removeItem('buy_digital_cart')
      return []
    }
  }
]

export const cartActionList = [
  ...cartActions
]