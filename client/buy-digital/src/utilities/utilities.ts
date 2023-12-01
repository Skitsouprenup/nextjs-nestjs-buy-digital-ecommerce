import { ProductSkuDetails } from "@/types/crud_payload/products/productspayload"
import { showAppToast } from "./apptoastutils"
import { rootContextType } from "context"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { expiredToken } from "./verificationutils"

export const sortSkuDetailsByDays = (skuDetails: Array<ProductSkuDetails>) => {
  return skuDetails.sort(
      (
        a: { validityInDays: number }, 
        b: { validityInDays: number }
      ) => a.validityInDays - b.validityInDays
  )
}

export const getUserInfoInLocalStorage = (
  rootContext: rootContextType, 
  router: AppRouterInstance
) => {
  const userInfo = JSON.parse(localStorage.getItem('user') as string)

  if(!userInfo) {
    showAppToast(
      rootContext, 
      "Incomplete login credentials. Please login again."
    )
    router.push('/login')

    return {}
  }

  return userInfo
}

export const tokenExpiredOrSomethingElse = (error: unknown, rootContext: rootContextType) => {
  const errorData = error as 
  { response: { data: { exception: Record<string, unknown> } }}

  const exceptionName = errorData.response.data.exception?.name
  const exceptionMsg = errorData.response.data.exception?.message
  const exceptionTxt = exceptionMsg ? exceptionMsg : 'Something went wrong!'
  

  if(!expiredToken(
    exceptionName as string,
    rootContext
  )) showAppToast(
    rootContext,
    exceptionTxt as string
  )
}

export const convertCentsToUsd = (amountInCents: number) => {
  return Number((amountInCents / 100).toFixed(2))
}

export const convertUsdToCents = (amountInUsd: number) => {
  return Number((amountInUsd * 100).toFixed(2))
}

export const simpleDateTimeFormat = (date: Date | undefined) => {
  if(!date) return ''

  const newDate = new Date(date.toString())

  let hours = newDate.getHours()
  let minutes = newDate.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0'+minutes : minutes
  const strTime = hours + ':' + minutesStr + ' ' + ampm
  return (newDate.getMonth()+1) + "/" + newDate.getDate() + "/" + newDate.getFullYear() + "  " + strTime
}