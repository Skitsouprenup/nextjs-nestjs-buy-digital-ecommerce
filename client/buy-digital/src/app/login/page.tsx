import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import LoginContent from 'src/components/credentialforms/LoginContent'

export default function Login() {
  return (
    <Container>
      <Card>
        <LoginContent />
      </Card>
    </Container>
  )
}