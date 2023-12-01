'use client'

import { useReducer, createContext } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'

import { actionList } from "./actionlist"
import { cartActionList } from "./cartactionlist"

type Props = {
  children: React.ReactNode
};

const initialState = {
  user: null,
  showAppToast: false,
  appToastMsg: ''
};

type rootContextType = {
  state: Record<string, unknown>,
  dispatch: (action: { type: string, payload: unknown }) => void,
  cartItems: unknown,
  cartDispatch: (action: { type: string, payload: unknown }) => void
};

const initialContext: rootContextType = {
  state: initialState,
  dispatch: () => null,
  cartItems: [],
  cartDispatch: () => null,
};
const RootContext = createContext<rootContextType>(initialContext);

const userReducer = (
  state: Record<string, any>,
  action: { type: string, payload: unknown }
) => {
  for(let i = 0; i < actionList.length; i++) {
    if(action.type === actionList[i].name) {
      
      const data = actionList[i].action(state, action.payload)
      return data
    }
  }
  return state
};

const cartReducer = (
  state: unknown,
  action: { type: string, payload: unknown }
) => {
  for(let i = 0; i < cartActionList.length; i++) {
    if(action.type === cartActionList[i].name) {
      const data = cartActionList[i].action(state, action.payload)
      return data
    }
  }
  return state
}

const Provider = ({ children }: Props) => {
  const[state, dispatch] = useReducer(userReducer, initialState)
  const[cartItems, cartDispatch] = useReducer(cartReducer, [])
  const router = useRouter()

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if(error.response.status === 401) {
        return new Promise(
          () => {
            dispatch({
              type: 'LOGOUT',
              payload: null,
            });
            localStorage.removeItem('user');
            router.push('/login');
          }
        );
      }
      else {
        return Promise.reject(error)
      }
    }
  );

  return (
    <RootContext.Provider value={{ state, dispatch, cartItems, cartDispatch }}>
      {children}
    </RootContext.Provider>
  );
};

export { RootContext, Provider };
export type { rootContextType };