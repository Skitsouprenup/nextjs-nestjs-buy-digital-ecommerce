'use client'

import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import { FC, useContext, useState } from 'react'

import { RootContext } from 'context'
import { useRouter } from 'next/navigation'

const ProfileTabs: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const rootContext = useContext(RootContext)
  const router = useRouter()

  const [logout, setLogout] = useState<boolean>(false)

  const logoutUser = () => {
    localStorage.removeItem('user')

    rootContext.dispatch({
      type: 'LOGOUT',
      payload: {
        user: null
      }
    })

    router.push('/login')
  }

  return (
    <Tab.Container id="vertical-tabs" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className='flex-column'>
            <Nav.Item>
              <Nav.Link eventKey="first" disabled={logout}>
                Account Details
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="second" disabled={logout}>
                Orders
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link 
                eventKey="third" 
                onClick={() => {
                  logoutUser()
                  setLogout(true)
                }}
              >
                Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            {children}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

export default ProfileTabs