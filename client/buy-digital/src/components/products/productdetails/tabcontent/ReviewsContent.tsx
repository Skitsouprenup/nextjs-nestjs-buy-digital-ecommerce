"use client"

import { FC, useState } from "react"
import ProductRating from "../../productitem/ProductRating"
import AddReviewForm from "./reviewscontent/AddReviewForm"


const ReviewsContent:FC<{
  feedbacks: Array<Record<string, unknown>>
  productId: string
}> = ({ feedbacks, productId }) => {
  const[userFeedbacks, setUserFeedbacks] = 
    useState<Array<Record<string, unknown>>>(feedbacks)

  return (
    <div
      className="d-flex flex-column gap-2"
      style={{
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      {
        userFeedbacks.length <= 0 ? (
          <h6>No Reviews Found.</h6>
        ) : (
          userFeedbacks.map((item, index) => (
            <div key={`${Math.random()}-${index}`}>
              <div className="d-flex flex-column gap-1">
                <span>{item?.name as string}</span>
                <ProductRating ratingAvg={item?.rating as number}/>
              </div>
              <p>{item?.message as string}</p>
            </div>
          ))
        )
      }

      <AddReviewForm 
        productId={productId}
        feedbacks={userFeedbacks}
        setFeedbacks={setUserFeedbacks}
      />
    </div>
  )
}

export default ReviewsContent