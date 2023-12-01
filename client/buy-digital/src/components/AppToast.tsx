'use client'

import { useContext } from 'react'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

import { RootContext } from 'context'

const AppToast = () => {
 const rootContext = useContext(RootContext)

  return (
    <ToastContainer
      position='top-end'
      className='m-2'
      style={{position: 'fixed'}}
    >
      <Toast
        show={rootContext.state.showAppToast as boolean}
        onClose={() => 
          rootContext.dispatch({
             type: 'SHOW_APP_TOAST',
             payload: {
              show: false,
              message: ''
             }
          })
        } 
        bg='dark'
        delay={3000}
        autohide
      >
        <Toast.Header
          className='text-white bg-dark toast-header-dark'
        >
          {
            /*
            <Image 
              src="..." 
              className="rounded me-2"
              width={15}
              height={15} 
              alt="..." 
              unoptimized
            />
            */
          }
          <strong className="me-auto">Information</strong>
          <small>Buy Digital!</small>
        </Toast.Header>
        <Toast.Body className='text-white'>
          {rootContext.state.appToastMsg as string}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default AppToast