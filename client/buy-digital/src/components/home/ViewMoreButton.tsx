'use client'

import Button from "react-bootstrap/Button"

import { useRouter } from "next/navigation"

const ViewMoreButton = () => {
  const router = useRouter()

  return (
    <Button 
      className="btn btn-primary"
      onClick={() => router.push('/products')}
    >
      View More
    </Button>
  )
}

export default ViewMoreButton