import { FC } from "react"

const DescriptionContent:FC<{
  description: string
}> = ({ description }) => {
  return (
    <p>{description}</p>
  )
}

export default DescriptionContent