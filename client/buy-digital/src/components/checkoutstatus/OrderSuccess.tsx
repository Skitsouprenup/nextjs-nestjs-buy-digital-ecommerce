import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ShopMoreButton from './ShopMoreButton'

const OrderSuccess = () => {
  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        <div className="jumbotron text-center">
          <h1 className="display-6 text-center">
            Yay! Order has been completed!
          </h1>

          <p>
            <strong>Payment complete!</strong> We sent you
            an e-mail regarding your order.
          </p>

          <hr />

          <ShopMoreButton success={true} />
        </div>
      </Col>
    </Row>
  )
}

export default OrderSuccess