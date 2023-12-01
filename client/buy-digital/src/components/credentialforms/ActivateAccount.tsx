'use client'

import { FC, useState, useContext } from "react"
import { useRouter } from "next/navigation"

import validator from 'validator'
import { RootContext } from 'context'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import TextField from '../formfields/TextField'
import { userEndpoints } from "@/services/user.service"

interface OtpData {
  email: string
  otp: string
}

const ActivateAccount: FC<{ email: string}> = ({ email }) => {
  const rootContext = useContext(RootContext)
  const [otpData, setOtpData] = useState<OtpData>({ email: decodeURIComponent(email), otp: ''})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const sendOtp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const {success, message } = 
        await userEndpoints.activateAccount(otpData.email, otpData.otp)

      if(success) {
        rootContext.dispatch({
          type: 'SHOW_APP_TOAST',
          payload: {
            show: true, 
            message
          }
        })
        router.push('/login')
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
      <Card.Header>Activate Account</Card.Header>
      <Card.Body>
      <Form 
          className='d-flex flex-column gap-2' 
      >
        <TextField
          controlId='emailAddress' 
          label='E-mail Address'
          dataValue={otpData.email}
          dataName='email'
          type='email'
          data={otpData} 
          setData={setOtpData} 
        />
        <TextField
          controlId='oneTimePassword' 
          label='OTP'
          dataValue={otpData.otp}
          dataName='otp'
          type='text'
          data={otpData} 
          setData={setOtpData} 
        />

        <div className='d-flex gap-2'>
          {
            !isLoading ? <>
              <Button
                onClick={(e) => sendOtp(e)}
                className='btn btn-primary'
              >
              Send OTP
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

export default ActivateAccount