import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import RegisterContent from 'src/components/credentialforms/RegisterContent'

export default function Register() {
  return (
    <Container>
      <Card>
        <RegisterContent />
      </Card>
    </Container>
  )
}