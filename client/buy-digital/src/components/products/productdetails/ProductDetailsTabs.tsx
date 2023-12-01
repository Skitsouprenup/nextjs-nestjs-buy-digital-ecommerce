'use client'

import Tab from "react-bootstrap/Tab"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"
import { FC, useEffect, useState } from "react"

const ProductDetailsTabs: FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const[showSku, setShowSku] = useState<boolean>(false)

  useEffect(() => {
    const userInfo: Record<string, unknown> = 
      JSON.parse(localStorage.getItem('user') as string)
    const user = userInfo?.user as Record<string, unknown>
    const role = user?.role as string

    if(role === 'admin') setShowSku(true)
  }, [])

  return (
    <Tab.Container id="vertical-tabs" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className='d-flex flex-column'>
            <Nav.Item>
              <Nav.Link eventKey="first">
                Description
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="second">
                Requirements
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="third">
                Reviews
              </Nav.Link>
            </Nav.Item>

            {
              showSku ? (
                <Nav.Item>
                  <Nav.Link eventKey="fourth">
                    Product SKUs
                  </Nav.Link>
                </Nav.Item>
              ) : null
            }
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content className="p-1">
            {children}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

export default ProductDetailsTabs