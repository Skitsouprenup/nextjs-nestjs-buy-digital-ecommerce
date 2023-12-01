import React from 'react'
import { useRouter } from 'next/navigation';

const BrandLink = () => {
  const router = useRouter();

  return (
    <h3 
      onClick={() => router.push('/')}
      style={{cursor: 'pointer'}}
    >
      Buy Digital!
    </h3>
  )
}

export default BrandLink