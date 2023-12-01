import { productEndpoints } from "@/services/product.service"
import { getUserInfoInLocalStorage, tokenExpiredOrSomethingElse } from "../utilities"
import { rootContextType } from "context"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { Dispatch, SetStateAction } from "react"
import { showAppToast } from "../apptoastutils"

export const setSkuLicenseSubmitButtonName = (mode: string) => {
  let name = ''

  switch(mode) {
    case 'Add':
      name = 'Add'
      break

    case 'Edit':
      name = 'Update'
      break
  }

  return name
}

export const executeAddOrUpdate = async (
  productId: string,
  skuId: string,
  licenseId: string,
  rootContext: rootContextType,
  licenseForm: Record<string, unknown>,
  router: AppRouterInstance,
  setLoading: Dispatch<SetStateAction<boolean>>,
  licenseList: Array<Record<string, unknown>>,
  setLicenseList: Function,
  mode: string,
  setFormMode: Function
) => {

  const userInfo = 
        getUserInfoInLocalStorage(rootContext, router)

  try{
    setLoading(true)

    const headers = {
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${userInfo?.token}`
      }
    }

    switch(mode) {

      case 'Add':
        const addResponse = 
          await productEndpoints.addLicense(productId, skuId, licenseForm, headers)

        if(addResponse?.success) {
          setFormMode({ mode: '', licenseId: '', keyLicense: ''})
          setLicenseList([...licenseList, addResponse.content])
          showAppToast(rootContext, addResponse.message)
        }

        break;
  
      case 'Edit':
        const editResponse =
          await productEndpoints.updateLicenseKey(
            productId, 
            skuId, 
            licenseId, 
            licenseForm, 
            headers
          )

        if(editResponse?.success) {
          const editedLicense = 
          licenseList.find(
            (item) => item?._id === licenseId
          ) as Record<string, unknown>
          editedLicense['licenseKey'] = licenseForm?.licenseKey

          const newLicenseList = 
          licenseList.filter((item) => item?._id !== licenseId)

          setFormMode({ mode: '', licenseId: '', keyLicense: ''})
          setLicenseList([...newLicenseList, editedLicense])
          showAppToast(rootContext, editResponse?.message)
        }
        break;
    }
  }
  catch(error) {
    console.error(error)
    tokenExpiredOrSomethingElse(error, rootContext)
  }
  finally {
    setLoading(false)
  }
}