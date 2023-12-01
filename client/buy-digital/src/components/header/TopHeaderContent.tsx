'use client'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import InputGroup from 'react-bootstrap/InputGroup'
import { PersonCircle, Search } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import BrandLink from './BrandLink'

import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'

import { RootContext } from 'context'

const TopHeaderContent = () => {
  const router = useRouter()
  const rootContext = useContext(RootContext)

  const[searchText, setSearchText] = useState<string>('')  

  const search = () => {
    if(searchText.trim())
      router.push(`/products?search=${searchText}`)
  }

  return (
    <Row className='gy-2 mb-2'>
        <Col 
          xs={4}
          md={3}
          className={`d-flex align-items-center`}
        >
          <BrandLink />
        </Col>
        <Col xs={8} md={6}>
          <InputGroup>
            <InputGroup.Text id="search">
              <Search />
            </InputGroup.Text>
            <Form.Control 
              aria-label="search" 
              placeholder="Search Product..."
              type='text'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button 
              variant="outline-secondary"
              onClick={search}
            >
              Search
            </Button>
          </InputGroup>
        </Col>
        {
          rootContext.state.user ? (
            <Col xs={12} md={3} className='d-flex flex-row-reverse'>
              <PersonCircle 
                size={40}
                color="#4c575f"
                style={{cursor: 'pointer'}}
                onClick={() => router.push('/profile')}
              />
            </Col>
          ) : null
        }
    </Row>
  )
}

export default TopHeaderContent