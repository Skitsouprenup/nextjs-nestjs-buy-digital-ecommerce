import RootPage from '@/components/shared/RootPage'
import HomePageContent from '@/components/home/HomePageContent'
import Container from 'react-bootstrap/Container'

export default function Home() {

  return (
    <>
      <Container>
        <RootPage>
          <HomePageContent />
        </RootPage>
      </Container>
    </>
  )
}
