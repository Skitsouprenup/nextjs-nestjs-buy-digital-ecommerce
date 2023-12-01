'use client'

import { useEffect, useState, useContext } from "react"
import AccountDetailsForm from "./AccountDetailsForm"

import Button from "react-bootstrap/Button"
import AccountDetails from "./AccountDetails"
import { userEndpoints } from "@/services/user.service"
import { AccountDetailsProperties } from "@/types/credentialforms/formtypes"

import { RootContext } from "context"
import { showAppToast } from "@/utilities/apptoastutils"

const AccountDetailsContent = () => {
  const [editMode, setEditMode] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [accountDetails, setAccountDetails] = 
    useState<AccountDetailsProperties | null>(null)

  const rootContext = useContext(RootContext)

  const saveChanges = async () => {
    
    for(const value of Object.values(accountDetails as AccountDetailsProperties)) {
      if(!value) {
        showAppToast(rootContext, 'Please fill-up all the fields.')
        return
      }
    }

    const newPass = accountDetails?.newPass as string
    if(newPass.length < 6) {
      showAppToast(rootContext, 'New password length must be greater than 6.')
      return
    }

    if(accountDetails?.newPass !== accountDetails?.confirmNewPass) {
      showAppToast(rootContext, 'Invalid new password confirmation.')
      return
    }

    const userData = JSON.parse(localStorage.getItem('user') as string)
    if(!userData) {
      setAccountDetails(null)
      return
    }

    setIsLoading(true)

    try {
      const { success, message, content } = 
      await userEndpoints.updateUser(userData?.user?.id as string, {
          name: accountDetails?.name,
          oldPassword: accountDetails?.oldPass,
          newPassword: accountDetails?.newPass,
        }, {
          headers: {
            'Authorization': `Bearer ${userData?.token}`
          }
        }
      )

      if(success) {
        const resContent = content as Record<string, unknown>

        if(resContent?.user) {
          localStorage.setItem('user',JSON.stringify(
            {
              user: resContent.user,
              token: userData?.token
            }
          ))
    
          setAccountDetails(
            {
              ...resContent.user, 
              oldPass: '', 
              newPass: '',
              confirmNewPass: '',
            } as AccountDetailsProperties
          )
        } else setAccountDetails(null)
      }
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
      setEditMode(false)
    }
  }

  const getAccountDetails = async() => {
    const userData = JSON.parse(localStorage.getItem('user') as string)
  
    if(!userData) {
      setAccountDetails(null)
      setIsLoading(false)
      return
    }
  
    const { content } = await userEndpoints.getUser(userData?.user?.id)
    const resContent = content as Record<string, unknown>

    setIsLoading(false)

    if(resContent?.user) {
      setAccountDetails(
        {
          ...resContent.user, 
          oldPass: '', 
          newPass: '',
          confirmNewPass: '',
        } as AccountDetailsProperties
      )
    }
    else setAccountDetails(null)
  }

  useEffect(() => {
    getAccountDetails()
  }, [])

  if(isLoading)
    return <h3>Loading...</h3>

  if(!accountDetails)
    return <h3>Can&apos;t Fetch Data</h3>

  return (
    <>
     {
      editMode ? 
        <AccountDetailsForm 
          accountDetails={accountDetails}
          setAccountDetails={setAccountDetails}/> :
        <AccountDetails 
          name={accountDetails?.name}
          email={accountDetails?.email}
        />
     }
     <div className="d-flex gap-2 mt-2">
      {
        editMode ? 
          <Button 
            className="btn btn-success"
            onClick={() => saveChanges()}
          >
            Save
          </Button> :
          null
      }
      {
        accountDetails ? 
          <Button 
            className="btn btn-secondary"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit'}
          </Button> : null
      }
     </div>
    </>
  )
}

export default AccountDetailsContent