import { rootContextType } from "context"
import { showAppToast } from '@/utilities/apptoastutils'

export const expiredToken = (
  name: string, 
  rootContext: rootContextType,
  message?: string
) => {
  if(name === 'TokenExpiredError') {
    showAppToast(
      rootContext, 
      message ? 
        message : 'Token expired. Please login again.'
    )
    return true
  }
  return false
}