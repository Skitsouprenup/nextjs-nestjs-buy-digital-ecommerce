'use client'

import { useContext, useState } from 'react'
import { useRouter } from "next/navigation"
//import Image from 'next/image'

import 'src/styles/logincontent.css'

import { RootContext } from 'context'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import TextField from '../formfields/TextField'

import { LoginFormData } from '../../types/credentialforms/formtypes'
import { loginFormData } from '../../constants/credentialforms/formConstants'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { userEndpoints } from '@/services/user.service'
import { showAppToast } from '@/utilities/apptoastutils'

const LoginContent = () => {
  const rootContext = useContext(RootContext)
  const [loginData, setLoginData] = useState<LoginFormData>(loginFormData)
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const router = useRouter()

  const loginUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      for(const item in loginData) {
        if(!loginData[item]) throw new Error('Please fill-up all fields!')
      }

      const {success, message, content } = await userEndpoints.loginUser({
        email: loginData.email,
        password: loginData.password
      })

      if(success) {
        const data = content as { user: Record<string, unknown>, token: string }

        localStorage.setItem('user', JSON.stringify(data))

        showAppToast(rootContext, message)

        rootContext.dispatch({
          type: 'LOGIN',
          payload: {
            user: data.user
          }
        })

        router.push('/')
      } else throw new Error(message || 'Something went wrong!')
    }
    catch(error: any) {
      console.error('Error: ' + error)
      showAppToast(
        rootContext, 
        error.response ? 
        error.response.data.message :
        error.message
      )
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card.Header>Login</Card.Header>
      <Card.Body>
        <Form 
          className='d-flex flex-column gap-2'
        >
          <TextField 
            controlId='email'
            label='E-mail'
            dataValue={loginData.email}
            dataName='email'
            type='email'
            data={loginData} 
            setData={setLoginData} 
          />
          <TextField 
            controlId='password'
            label='Password'
            dataValue={loginData.password}
            dataName='password'
            type='password'
            data={loginData} 
            setData={setLoginData} 
          />

          <Container className='p-0'>
            <Row>
              <Col className='d-flex gap-2 align-items-center'>
                <Button
                  onClick={(e) => loginUser(e)}
                  className='btn btn-primary'
                  style={{ height: 'fit-content'}}
                >
                  Login
                </Button>

                <Button
                  onClick={() => router.push('/register')}
                  className='btn btn-primary'
                  style={{ height: 'fit-content'}}
                >
                  Register
                </Button>
              </Col>

              <Col className={`
                d-flex align-items-center justify-content-center flex-column col-8
                gap-1`
              }>
              <Button
                  onClick={() => router.push('/forgotpass')}
                  className='btn btn-link link-button p-0'
              >
                Reset Password
              </Button>
              <Button
                  onClick={() => router.push('/otp/resend')}
                  className='btn btn-link link-button p-0'
              >
                Resend OTP
              </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Card.Body>
    </>
  )
}

export default LoginContent