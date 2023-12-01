import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ActivateAccount from '@/components/credentialforms/ActivateAccount'

export default function SendOtp({ params } : { params: { email: string} }) {
  return (
    <Container>
      <Card>
        <ActivateAccount email={params.email} />
      </Card>
    </Container>
  )
}