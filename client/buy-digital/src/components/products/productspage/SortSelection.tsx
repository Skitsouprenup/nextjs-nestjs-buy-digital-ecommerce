'use client'

import { useState } from "react"

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from "react-bootstrap/DropdownButton"

import { useRouter } from 'next/navigation'

const SortSelection = () => {
  const router = useRouter()
  const [sortText, setSortText] = useState<string>('Rating')

  const selectSortType = (type: string | null): string => {
    if(type) {
      return type
    }
    else return 'Rating'
  }

  return (
    <DropdownButton 
      variant="outline-secondary" 
      title={sortText}
      onSelect={(e) => setSortText(selectSortType(e))}
    >
      <Dropdown.Item eventKey="Rating">
        Rating
      </Dropdown.Item>
      <Dropdown.Item eventKey="Latest">
        Latest
      </Dropdown.Item>
    </DropdownButton>
  )
}

export default SortSelection