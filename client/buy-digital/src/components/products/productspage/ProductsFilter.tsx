'use client'

import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import { useRouter } from 'next/navigation'

const ProductsFilter = ({}) => {
  const router = useRouter()

  const selectCategoryType = () => {

  }

  return (
    <Card style={{width: 'fit-content'}}>
      <Card.Header>Filter By</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <DropdownButton
            variant="outline-secondary" 
            title='test'
          >
            <Dropdown.Item eventKey="Rating">
              Rating
            </Dropdown.Item>
            <Dropdown.Item eventKey="Latest">
              Latest
            </Dropdown.Item>
          </DropdownButton>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default ProductsFilter