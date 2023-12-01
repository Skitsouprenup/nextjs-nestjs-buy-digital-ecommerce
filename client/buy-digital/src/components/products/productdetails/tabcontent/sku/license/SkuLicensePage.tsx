"use client"

import { FC, useContext, useEffect, useState } from "react"

import Button from "react-bootstrap/Button"
import { ArrowBarLeft, Pen, Trash2 } from "react-bootstrap-icons"
import { productEndpoints } from "@/services/product.service"

import { RootContext } from 'context'
import { showAppToast } from '@/utilities/apptoastutils'

import { useRouter } from "next/navigation"
import Table from "react-bootstrap/Table"
import DeleteLicenseModal from "@/components/shared/modals/DeleteLicenseModal"
import { SkuLicenseDetailsForForm } from "@/types/products/skutypings"
import SkuLicenseForm from "./SkuLicenseForm"
import { getUserInfoInLocalStorage, tokenExpiredOrSomethingElse } from "@/utilities/utilities"

const SkuLicensePage:FC<{
  productId: string,
  skuId: string,
  setSkuMode: React.Dispatch<React.SetStateAction<{ mode: string, skuId: string }>>
}> = ({ productId, skuId, setSkuMode }) => {
  const rootContext = useContext(RootContext)
  const router = useRouter()

  const[loadLicense, setLoadLicense] = useState<boolean>(true)
  const[delLoading, setDelLoading] = useState<boolean>(false)

  const[delLicenseDetails, setDelLicenseDetails] = 
    useState<{ id: string, key: string}>({ id: '', key: ''})
  const[openDelModal, setOpenDelModal] = useState<boolean>(false)

  const[formMode, setFormMode] = 
    useState<SkuLicenseDetailsForForm>(
      { mode: '', licenseId: '', keyLicense: '' }
    )
  
    const[licenseList, setLicenseList] = 
    useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    const getLicenseKeys = async () => {
      const userInfo = 
        getUserInfoInLocalStorage(rootContext, router)

      try {
        const headers = {
          headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${userInfo?.token}`
          }
        }

        const { success, content } = 
        await productEndpoints.
          getProductLicense(productId, skuId, false, headers)

        if(success) setLicenseList(content)
      }
      catch(error) {
        console.error(error)
        tokenExpiredOrSomethingElse(error, rootContext)
      }
      finally {
        setLoadLicense(false)
      }
    }
    getLicenseKeys()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteLicense = async () => {
    const userInfo = 
        getUserInfoInLocalStorage(rootContext, router)

    try {
      setDelLoading(true)

      const headers = {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${userInfo?.token}`
        }
      }

      const { success, message } = 
        await productEndpoints.deleteLicense(delLicenseDetails.id, headers)

      if(success) {
        const newLicenseList = 
          licenseList.filter((item) => item?._id !== delLicenseDetails.id)

        setLicenseList([...newLicenseList])
        setDelLicenseDetails({ id: '', key: ''})
        showAppToast(rootContext, message)
      }
    }
    catch(error) {
      console.error(error)
      tokenExpiredOrSomethingElse(error, rootContext)
    }
    finally {
      setDelLoading(false)
      setOpenDelModal(false)
    }
  }

  if(loadLicense) {
    return <h6>Loading Licenses...</h6>
  }

  if(!loadLicense && !licenseList.length) {
    return <div className="d-flex flex-column gap-2">
      <Button 
        variant="secondary"
        style={{width: '125px'}}
        className="d-flex align-items-center gap-1"
        onClick={() => setSkuMode({ mode: '', skuId: ''})}
      >
        <ArrowBarLeft /> Return
      </Button>
      <h6>No Licenses Found.</h6>
    </div>
  }

  return (
    <div className="d-flex flex-column gap-2">
      <Button 
        variant="secondary"
        style={{width: '125px'}}
        className="d-flex align-items-center gap-1"
        onClick={() => setSkuMode({ mode: '', skuId: ''})}
      >
        <ArrowBarLeft /> Return
      </Button>

      <Button 
        variant="primary"
        style={{width: '125px'}}
        onClick={() => {
          if(formMode.mode === 'Add')
            setFormMode({ mode: '', licenseId: '', keyLicense: '' })
          else setFormMode({ mode: 'Add', licenseId: '', keyLicense: '' })
        }}
      >
        Add License
      </Button>

      {
        formMode.mode ?
          <SkuLicenseForm
            productId={productId}
            skuId={skuId}
            formMode={formMode}
            licenseList={licenseList}
            setLicenseList={setLicenseList}
            setFormMode={setFormMode}
          /> : null
      }

      <Table responsive>
        <thead>
          <tr>
            <th>License key</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {
            licenseList.map((item) => (
              <tr key={item?._id as string}>
                <td>
                  {item?.licenseKey as string}
                </td>

                <td className="d-flex gap-2 align-items-center">
                  <Button
                    variant="secondary"
                    onClick={() => 
                      setFormMode({
                         mode: 'Edit', 
                         licenseId: item?._id as string,
                         keyLicense: item?.licenseKey as string
                      })
                    }
                  >
                    <Pen />
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => {
                      setDelLicenseDetails({ 
                        id: item?._id as string,
                        key: item?.licenseKey as string
                      })
                      setOpenDelModal(true)
                    }}
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>

      <DeleteLicenseModal 
        deleteLicense={deleteLicense}
        openModal={openDelModal}
        setOpenModal={setOpenDelModal}
        loading={delLoading}
        licenseKey={delLicenseDetails.key}
      />
    </div>
  )
}

export default SkuLicensePage