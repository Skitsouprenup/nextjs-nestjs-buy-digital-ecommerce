import { FC } from "react"
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import { AccountDetailsProperties } from "@/types/credentialforms/formtypes"

const AccountDetailsForm:FC<{
  accountDetails: AccountDetailsProperties | null,
  setAccountDetails: Function
}> = ({ accountDetails, setAccountDetails }) => {

  return (
    <Card>
      <Card.Header>Account Details</Card.Header>
      <Card.Body>
        <Form className="d-flex gap-2 flex-column">
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email"
              disabled={true} 
              placeholder="Enter email"
              value={accountDetails?.email ? accountDetails.email as string : ''}
              onChange={(e) => setAccountDetails({...accountDetails, email: e.target.value})}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter name"
              value={accountDetails?.name ? accountDetails.name as string : ''}
              onChange={(e) => setAccountDetails({ ...accountDetails, name: e.target.value})}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Old Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter old password"
              value={accountDetails?.oldPass as string}
              onChange={(e) => setAccountDetails({ ...accountDetails, oldPass: e.target.value})}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter new password"
              value={accountDetails?.newPass as string}
              onChange={(e) => setAccountDetails({ ...accountDetails, newPass: e.target.value})}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Confirm password"
              value={accountDetails?.confirmNewPass as string}
              onChange={(e) => 
                setAccountDetails({ ...accountDetails, confirmNewPass: e.target.value})}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default AccountDetailsForm