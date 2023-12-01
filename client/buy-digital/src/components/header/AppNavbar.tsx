import Container from 'react-bootstrap/Container'
import TopHeaderContent from './TopHeaderContent'
import NavbarContent from './NavbarContent'

const AppNavbar = () => {

  return (
    <Container className='my-3'>
      <TopHeaderContent />
      <NavbarContent />
    </Container>
  )
}

export default AppNavbar