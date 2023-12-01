import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ResendOtpContent from '@/components/credentialforms/ResendOtpContent'

export default function ResendOtp() {

  return(
    <Container>
      <Card>
        <ResendOtpContent />
      </Card>
    </Container>
  )
}