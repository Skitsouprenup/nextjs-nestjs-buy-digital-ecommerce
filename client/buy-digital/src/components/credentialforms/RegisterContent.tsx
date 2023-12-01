'use client'

import { useState, useContext } from 'react'
import { useRouter } from "next/navigation"
import validator from 'validator'
import { RootContext } from 'context'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import TextField from '../formfields/TextField'
import { RegisterFormData } from '../../types/credentialforms/formtypes'
import { registerFormData } from '../../constants/credentialforms/formConstants'
import { RegistrationRequestPayload } from '@/types/crud_payload/requestpayload'
import { userEndpoints } from '@/services/user.service'

const RegisterContent = () => {
  const rootContext = useContext(RootContext)
  const [registerData, setRegisterData] = useState<RegisterFormData>(registerFormData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const registerUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    
    try {
      setIsLoading(true)

      if(!registerData.email || 
         !registerData.fullname || 
         !registerData.password ||
         !registerData.confirmPass) {
          throw new Error("Please fill-up all fields!");
      }
  
      if(registerData.password !== registerData.confirmPass)
        throw new Error('Failed Password Confirmation.')
  
      if(registerData.password.length < 6)
        throw new Error('Password length must be 6 character long or higher.')
  
      if(!validator.isEmail(registerData.email))
        throw new Error('E-mail Address is invalid.')
  
      const requestPayload: RegistrationRequestPayload = {
        email: registerData.email,
        name: registerData.fullname,
        password: registerData.password,
        role: 'customer'
      }
  
      const {success, message, content } = 
        await userEndpoints.createUser(requestPayload)

      if(success) {
        const data: { email: string } = content as { email: string }
        rootContext.dispatch({
          type: 'SHOW_APP_TOAST',
          payload: {
            show: true, 
            message
          }
        })

        router.push(`otp/activate/${encodeURIComponent(data.email)}`)
      } else throw new Error(message || 'Something went wrong!')
    }
    catch(error: any) {
      //console.log(error)
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
  };

  return (
    <>
      <Card.Header>Register</Card.Header>
      <Card.Body>
        <Form 
          className='d-flex flex-column gap-2' 
        >
          <TextField 
            controlId='email'
            label='E-mail Address'
            dataValue={registerData.email}
            dataName='email'
            type='email'
            data={registerData} 
            setData={setRegisterData} 
          />
          <TextField 
            controlId='fullName'
            label='Full Name'
            dataValue={registerData.fullname}
            dataName='fullname'
            type='text'
            data={registerData} 
            setData={setRegisterData} 
          />
          <TextField 
            controlId='password'
            label='Password'
            dataValue={registerData.password}
            dataName='password'
            type='password'
            data={registerData} 
            setData={setRegisterData} 
          />
          <TextField 
            controlId='confirmPassword'
            label='Confirm Password'
            dataValue={registerData.confirmPass}
            dataName='confirmPass'
            type='password'
            data={registerData} 
            setData={setRegisterData} 
          />

          <div className='d-flex gap-2'>
            {!isLoading ? <>
              <Button
                onClick={(e) => registerUser(e)}
                className='btn btn-primary'
              >
                Register
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

export default RegisterContent