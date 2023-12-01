'use client'

import { useState, useContext } from "react"
import { useRouter } from "next/navigation"

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import TextField from '../formfields/TextField'
import { userEndpoints } from "@/services/user.service"

import validator from 'validator'
import { RootContext } from 'context'
import { showAppToast } from "@/utilities/apptoastutils"

const ResendOtpContent = () => {
  const rootContext = useContext(RootContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [otpData, setOtpData] = useState<Record<string, unknown>>({ email: '' })
  const router = useRouter()

  const resendOtp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const email = otpData?.email as string
    if(!email.trim()) {
      showAppToast(rootContext, "Please fill up the field.")
      return
    }

    try {
      const { success, message } = 
        await userEndpoints.resendOtp(otpData?.email as string)

      if(!validator.isEmail(otpData?.email as string)) {
        rootContext.dispatch({
          type: 'SHOW_APP_TOAST',
          payload: {
            show: true, 
            message: 'Invalid e-mail address'
          }
        })
      }

      if(success && validator.isEmail(otpData?.email as string)) {
        router.push(`/otp/activate/${otpData.email}`)
        rootContext.dispatch({
          type: 'SHOW_APP_TOAST',
          payload: {
            show: true, 
            message
          }
        })
      }
    }
    catch(error: any) {
      console.error('Error: ' + error)
      rootContext.dispatch({
        type: 'SHOW_APP_TOAST',
        payload: {
          show: true, 
          message: error.response ? 
            error.response.data.message :
            error.message
        }
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card.Header>Resend OTP</Card.Header>
      <Card.Body>
        <Form 
            className='d-flex flex-column gap-2' 
        >
          <TextField 
            controlId='email'
            label='E-mail Address'
            dataValue={otpData?.email as string}
            dataName='email'
            type='text'
            data={otpData} 
            setData={setOtpData} 
          />

        <div className='d-flex gap-2'>
          {
            !isLoading ? <>
              <Button
                onClick={(e) => resendOtp(e)}
                className='btn btn-primary'
              >
              Resend OTP
              </Button>

              <Button
                onClick={() => router.push('/login')} 
                className='btn btn-danger'
              >
                Cancel
              </Button>
            </> :
            <h5>Please wait...</h5>
          }
        </div>
        </Form>
      </Card.Body>
    </>
  )
}

export default ResendOtpContent