'use client'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Badge from 'react-bootstrap/esm/Badge'
import NavLink from './NavLink'

import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { RootContext } from 'context'

import CartOffcanvas from '../cart/CartOffcanvas'
import { Cart } from 'react-bootstrap-icons'
import { computeTotalPriceInCart } from '@/utilities/cartutilities'

const NavbarContent = () => {
  const router = useRouter()
  const rootContext = useContext(RootContext)
  const cartItems = rootContext.cartItems as Array<Record<string, unknown>>

  const[showCartSidebar, setShowCardSidebar] = useState<boolean>(false)

  const searchProductByDeviceType = (e: string | null) => {
    const deviceType = e as string

    if(deviceType === 'All') {
      router.push('/products')
      return
    }

    router.push(`/products?deviceType=${deviceType}`)
  }

  return (
    <Navbar 
      expand="lg" 
      className="bg-body-tertiary"
      color="#4c575f"
    >
      <Container>
        <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className='me-auto'>
              <NavLink label="Home" route="/" />
              <NavDropdown 
                title="products" 
                id="products-nav-dropdown"
                onSelect={searchProductByDeviceType}
              >
                <NavDropdown.Item eventKey="Computer">
                  Computer
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="Mobile">
                  Mobile
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="All">
                  All
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {
              rootContext.state?.user ? (
                <Nav>
                  <Nav.Link
                    onClick={() => setShowCardSidebar(true)}
                    className='d-flex gap-1 align-items-center'
                  >
                    <span className='d-inline-flex align-items-center'>
                      <Cart />
                      <Badge
                        pill
                        bg="secondary"
                      >
                        {cartItems.length}
                      </Badge>
                    </span>
                    <span>
                      <b>$</b>
                      {`${computeTotalPriceInCart(cartItems)}`}
                    </span>
                  </Nav.Link>
                </Nav>
              ) : null
            }
          </Navbar.Collapse>
      </Container>
      <CartOffcanvas 
        show={showCartSidebar} 
        setShow={setShowCardSidebar} 
      />
    </Navbar>
  )
}

export default NavbarContent