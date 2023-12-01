import { rootContextType } from 'context'

export const showAppToast = (rootContext: rootContextType, message: string) => {
  rootContext.dispatch({
    type: 'SHOW_APP_TOAST',
    payload: {
      show: true, 
      message
    }
  })
}