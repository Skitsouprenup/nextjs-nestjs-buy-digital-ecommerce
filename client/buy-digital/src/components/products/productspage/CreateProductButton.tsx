'use client'

import Button from 'react-bootstrap/Button'
import { PlusCircle } from 'react-bootstrap-icons'

import { RootContext } from 'context'
import { useContext, useEffect, useState } from 'react'
import { UserInfo } from '@/types/credentialforms/usercredentials'

import { useRouter } from 'next/navigation'

const CreateProductButton = () => {
  const rootContext = useContext(RootContext);
  const [isAdmin, setIsAdmin] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const userData = rootContext.state?.user as UserInfo

    if(userData) {
      const role = userData.role
      setIsAdmin(role)
    }

  }, [rootContext.state]);

  return (
    <>
      {
        isAdmin.toLocaleLowerCase() === 'admin' ?
          <Button
            onClick={() => router.push('/products/create')}
          >
            <span className='d-flex align-items-center gap-1'>
              <PlusCircle /> Create Product
            </span>
          </Button> :
          null
      }
    </>
  )
}

export default CreateProductButton