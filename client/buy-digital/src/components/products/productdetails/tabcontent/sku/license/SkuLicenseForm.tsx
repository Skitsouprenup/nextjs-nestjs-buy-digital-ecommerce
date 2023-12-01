import { SkuLicenseDetailsForForm } from '@/types/products/skutypings'
import React, { FC, Dispatch, SetStateAction, useState, useContext, useEffect } from 'react'

import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"
import TextField from '@/components/formfields/TextField'
import { executeAddOrUpdate, setSkuLicenseSubmitButtonName } from '@/utilities/skulicense/skulicensehelper'

import { RootContext } from 'context'
import { useRouter } from 'next/navigation'

const SkuLicenseForm:FC<{
  productId: string
  skuId: string
  formMode: SkuLicenseDetailsForForm
  licenseList: Array<Record<string, unknown>>
  setLicenseList: Dispatch<SetStateAction<Array<Record<string, unknown>>>>
  setFormMode: Dispatch<SetStateAction<SkuLicenseDetailsForForm>>
}> = ({ 
  productId, 
  skuId, 
  formMode, 
  licenseList, 
  setLicenseList, 
  setFormMode
}) => {
  const[licenseForm, setLicenseForm] = useState<Record<string, unknown>>({})
  const[loading, setLoading] = useState<boolean>(false)
  const rootContext = useContext(RootContext)
  const router = useRouter()

  useEffect(() => {
    setLicenseForm({
      ...licenseForm,
      ['licenseKey']: formMode.keyLicense
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMode])

  return (
    <div className="d-flex flex-column gap-2">

      <Form>
        <TextField 
          controlId='licensekey'
          label='License Key'
          dataValue={licenseForm?.licenseKey as string}
          type='text'
          dataName='licenseKey'
          data={licenseForm}
          setData={setLicenseForm}
        />
      </Form>

      <div className='d-flex gap-1'>
        {
          !loading ? (
            <>
              <Button 
                variant='success'
                onClick={() => 
                  executeAddOrUpdate(
                    productId, 
                    skuId, 
                    formMode.licenseId,
                    rootContext, 
                    licenseForm,
                    router, 
                    setLoading, 
                    licenseList,
                    setLicenseList, 
                    formMode.mode,
                    setFormMode
                  )
                }
              >
                {setSkuLicenseSubmitButtonName(formMode.mode)}
              </Button>

              <Button 
                variant='secondary'
                onClick={() => 
                  setFormMode({ mode: '', licenseId: '', keyLicense: ''})
              }
              >
                Cancel
              </Button>
            </>
          ): <p>Loading...</p>
        }
      </div>
    </div>
  )
}

export default SkuLicenseForm