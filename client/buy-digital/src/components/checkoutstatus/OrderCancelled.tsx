import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ShopMoreButton from './ShopMoreButton'

const OrderCancelled = () => {
  

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        <div className="jumbotron text-center">
          <h1 className="display-6 text-center">
            Oops! Order has been cancelled.
          </h1>

          <p>
            <strong>Payment failed!</strong> Please try
            again.
          </p>

          <hr />

          <ShopMoreButton />
        </div>
      </Col>
    </Row>
  )
}

export default OrderCancelled