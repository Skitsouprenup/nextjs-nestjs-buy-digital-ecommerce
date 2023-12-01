"use client"

import TextArea from "@/components/formfields/TextArea"
import ProductRating from "@/components/products/productitem/ProductRating"
import { userEndpoints } from "@/services/user.service"
import { getUserInfoInLocalStorage, tokenExpiredOrSomethingElse } from "@/utilities/utilities"
import { FC, useContext, useState, Dispatch, SetStateAction } from "react"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

import { RootContext } from "context"
import { useRouter } from "next/navigation"
import { showAppToast } from "@/utilities/apptoastutils"

const AddReviewForm:FC<{
  productId: string,
  feedbacks: Array<Record<string, unknown>>,
  setFeedbacks: Dispatch<SetStateAction<Array<Record<string, unknown>>>>
}> = ({ productId, feedbacks, setFeedbacks }) => {
  const rootContext = useContext(RootContext)
  const router = useRouter()

  const[reviewForm, setReviewForm] = useState<Record<string, unknown>>({})
  const[rating, setRating] = useState<number>(0)
  const[loading, setLoading] = useState<boolean>(false)

  const submitReview = async () => {
    if(!rating) {
      showAppToast(rootContext, "Please rate the product.")
    }

    const userInfo = getUserInfoInLocalStorage(rootContext, router)

    const payload = { ...reviewForm }
    payload['rating'] = rating

    try {
      setLoading(true)

      const headers = {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${userInfo?.token}`
        }
      }

      const { success, message } = 
      await userEndpoints.createReview(productId, payload, headers)

      if(success) {
        showAppToast(rootContext, message)

        const newReview = {
          message: payload?.review,
          name: userInfo?.user?.name,
          rating
        }

        setFeedbacks([ ...feedbacks, newReview ])
      }
    }
    catch(error) {
      console.error(error)
      tokenExpiredOrSomethingElse(error, rootContext)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {
        !loading ? (
          <Form className="d-flex flex-column gap-2">
            <TextArea 
              controlId="review-text-area"
              label="Add Review"
              dataValue={reviewForm?.review as string}
              dataName="review"
              data={reviewForm}
              setData={setReviewForm}
            />

            <div className="d-flex align-items-center">
              Rating:
              <ProductRating 
                ratingAvg={rating}
                readonly={false}
                setRating={setRating}
              />
            </div>

            <Button
              variant="success"
              onClick={submitReview}
              style={{
                width: 'fit-content'
              }}
            >
              Create Review
            </Button>
          </Form>
        ) : <h6>Loading...</h6>
      }
    </div>
  )
}

export default AddReviewForm