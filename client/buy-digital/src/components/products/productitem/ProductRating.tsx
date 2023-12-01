'use client'

import { FC, Dispatch, SetStateAction } from 'react'
import { Rating } from 'react-simple-star-rating'

const ProductRating:FC<{
  ratingAvg: number,
  readonly?: boolean,
  setRating?: Dispatch<SetStateAction<number>>
}> = ({ ratingAvg, readonly = true, setRating }) => {

  const handleRating = (rate: number) => {
    if(setRating) setRating(rate)
  }

  return (
    <Rating 
      initialValue={ratingAvg}
      allowFraction={true}
      size={24}
      readonly={readonly}
      onClick={handleRating}
    />
  )
}

export default ProductRating