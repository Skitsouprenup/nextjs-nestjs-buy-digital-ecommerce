import { FC } from "react"

import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'

const AccountDetails:FC<{
  name: unknown,
  email: unknown
}> = ({ name, email }) => {

  return (
    <>
      <Card>
        <Card.Header>Account Details</Card.Header>
        <Card.Body>
          <Stack gap={3}>
            <div className="p-2">
              <div className="mb-1">Name</div>
              <p>{name as string}</p>
            </div>

            <div className="p-2">
              <div className="mb-1">E-mail Address</div>
              <p>{email as string}</p>
            </div>
          </Stack>
        </Card.Body>
      </Card>
    </>
  )
}

export default AccountDetails