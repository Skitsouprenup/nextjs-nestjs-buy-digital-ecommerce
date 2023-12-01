"use client"

import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { productEndpoints } from '@/services/product.service'

import TextField from '@/components/formfields/TextField'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form"

import { showAppToast } from '@/utilities/apptoastutils'
import { expiredToken } from "@/utilities/verificationutils"

import { RootContext } from 'context'
import { ProductSkuDetails } from '@/types/crud_payload/products/productspayload'
import { convertCentsToUsd, convertUsdToCents } from '@/utilities/utilities'

const skuFormkeyList = [
  'name', 'price', 'validityInDays', 'lifetime'
]

const skuFormKeyListForUpdate = [
  '_id', 'name', 'price', 'validityInDays', 'lifetime',
  'createdAt', 'updatedAt', 'stripePriceId', 'skuCode'
]

/*
  Note: If skuid has value, this form is in 'edit' mode.
  Otherwise, this form is in 'add' mode.
*/
const ProductSkuForm:FC<{
  productId: string,
  skuList: Array<ProductSkuDetails>
  setSkuList: React.Dispatch<React.SetStateAction<Array<ProductSkuDetails>>>
  skuId?: string
  setSkuMode: React.Dispatch<React.SetStateAction<{ mode: string, skuId: string }>>
}> = ({ productId, setSkuMode, skuList, setSkuList, skuId }) => {
  const rootContext = useContext(RootContext)
  const router = useRouter()

  const getSku = () => {
    const sku = skuList.filter((item) => item._id === skuId)[0] as unknown
    return sku as Record<string, unknown>
  }

  const[skuForm, setSkuForm] = 
    useState<Record<string, unknown>>(skuId ? getSku() : {})
  const[loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if(!skuId)
      setSkuForm({
        ...skuForm,
        ['lifetime']: false
      })
    
    setSkuForm({
      ...skuForm,
      ['price']: convertCentsToUsd(skuForm?.price as number)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getLifetimeCheckValue = (e: ChangeEvent<HTMLInputElement>) => {
    const checkbox = e.target as HTMLInputElement

    setSkuForm({
      ...skuForm,
      ['validityInDays']: checkbox.checked ? '' : skuForm?.price,
      ['lifetime']: checkbox.checked
    })
  }

  const submitHandler = async () => {
    
    const keyList = skuId ? skuFormKeyListForUpdate : skuFormkeyList

    for(const item in skuForm) {
      if(item === 'validityInDays' && skuForm?.lifetime) continue

      if(!keyList.includes(item)) {
        showAppToast(rootContext, 'Please fill-up remaining fields')
        return
      }

      if(!skuForm[item] && item !== 'lifetime') {
        showAppToast(rootContext, 'Please fill-up remaining fields')
        return
      }
    }

    const userInfo = JSON.parse(localStorage.getItem('user') as string)

    if(!userInfo) {
      showAppToast(
        rootContext, 
        "Incomplete login credentials. Please login again."
      )
      router.push('/login')

      return
    }

    try {
      setLoading(true)

      const headers = {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${userInfo?.token}`
        }
      }

      const payload = { ...skuForm }
      payload['price'] = convertUsdToCents(skuForm?.price as number)

      const { success, message } = skuId ?
      await productEndpoints.updateSku(
        productId, 
        skuForm._id as string,
        payload,
        headers
      ) :
      await productEndpoints.createSku(
        productId,
        {
          skuList: [payload]
        },
        headers
      )

      if(success) {
        let newSkuList: Array<unknown> = []

        if(skuId) {
          newSkuList = skuList.filter((item) => item._id !== skuForm._id)
          newSkuList.push(skuForm)
        }
        else {
          newSkuList = [...skuList, skuForm]
        }

        showAppToast(rootContext, message)
        setSkuMode({ mode: '', skuId: '' })
        setSkuList(newSkuList as Array<ProductSkuDetails>)

        /*
          Reload the page so that the sku badges near product title
          will update as well
        */
        location.reload()
      }

    }
    catch(error) {
      console.error(error)

      const errorData = error as 
        { response: { data: { exception: Record<string, unknown> } }}

      if(!expiredToken(
        errorData.response.data.exception?.name as string,
        rootContext
      )) showAppToast(rootContext, 'Something went wrong!')
    }
    finally {
      setLoading(false)
    }

  }

  return(
    <div>
      <Form className='d-flex flex-column gap-2'>
        <TextField
          controlId='skuname' 
          label='Name'
          dataValue={skuForm?.name as string}
          dataName='name'
          type='text'
          data={skuForm} 
          setData={setSkuForm}
          disabled={loading ? true : false} 
        />

        <TextField
          controlId='skuprice' 
          label='Price'
          dataValue={skuForm?.price as string}
          dataName='price'
          type='text'
          data={skuForm} 
          setData={setSkuForm}
          disabled={loading ? true : false}
        />

        <Form.Group controlId='skuLifetime'>
          <Form.Label>Lifetime</Form.Label>
          <Form.Check 
            type='switch'
            checked={skuForm?.lifetime ? true : false}
            onChange={getLifetimeCheckValue}
            disabled={loading ? true : false}
          />
        </Form.Group>

        <TextField
          controlId='validdays' 
          label='Validity Duration'
          dataValue={skuForm?.validityInDays as string}
          dataName='validityInDays'
          type='text'
          data={skuForm} 
          setData={setSkuForm}
          disabled={skuForm?.lifetime ? true : loading ? true : false}
        />

        <div className='d-flex gap-2'>
          {
            !loading ? (
              <>
              <Button
                onClick={() => setSkuMode({ mode: '', skuId: '' })}
              >
                Cancel
              </Button>
              <Button
                onClick={submitHandler}
              >
                { skuId ? 'Update' : 'Add' }
              </Button>
              </>
            ) : <p>Loading...</p>
          }
        </div>
      </Form>
    </div>
  )
}

export default ProductSkuForm