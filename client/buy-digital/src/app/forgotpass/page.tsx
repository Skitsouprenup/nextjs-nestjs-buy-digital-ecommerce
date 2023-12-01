import Container from "react-bootstrap/Container"
import Card from "react-bootstrap/Card"
import ForgotPassContent from "@/components/credentialforms/ForgotPassContent"

const page = () => {
  return (
    <Container>
      <Card>
        <ForgotPassContent />
      </Card>
    </Container>
  )
}

export default page