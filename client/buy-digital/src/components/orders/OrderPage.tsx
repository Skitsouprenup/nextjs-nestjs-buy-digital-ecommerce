"use client"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import { RootContext } from "context"
import { useRouter } from "next/navigation"
import { ordersEndpoints } from "@/services/orders.service"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Image from "react-bootstrap/Image"
import Table from "react-bootstrap/Table"

import { OrderProperties } from "@/types/orders/orderstypings"
import { FC, Fragment, useContext, useEffect, useState } from "react"
import { convertCentsToUsd, getUserInfoInLocalStorage, simpleDateTimeFormat, tokenExpiredOrSomethingElse } from "@/utilities/utilities"
import Link from "next/link"
import { Clipboard } from "react-bootstrap-icons"

import { showAppToast } from "@/utilities/apptoastutils"

const OrderPage:FC<{
  orderId: string
}> = ({ orderId }) => {
  const rootContext = useContext(RootContext)
  const router = useRouter()

  const[order, setOrder] = useState<OrderProperties>()
  const[loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const userInfo = getUserInfoInLocalStorage(rootContext, router)

      try {
        const headers = {
          headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${userInfo?.token}`
          }
        }

        const { success, content } = 
          await ordersEndpoints.fetchOrder(orderId, headers)

        if(success) setOrder(content)
      }
      catch(error) {
        console.error(error)
        tokenExpiredOrSomethingElse(error, rootContext)
      }
      finally {
        setLoading(false)
      }
    }
    fetchOrder()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(loading)
    return <h6 className="display-6">Loading...</h6>

  return (
    <div className="d-flex flex-column gap-2">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>
                Order Details
              </Card.Title>
            </Card.Header>

            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>License Keys</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    {
                    order?.orderedItems.map((item) => (
                      <Fragment key={item.skuCode}>
                        <td>
                          <div className="d-flex gap-2 align-items-center">
                            <Image 
                              width={50}
                              height={50}
                              roundedCircle
                              alt='product'
                              src={item.productImage}
                            />

                            <span>
                              <Link href={`/products/${item.productId}`}>
                                {item.productName}
                              </Link>
                            </span>
                          </div>

                          <p>
                            Quantity: x{item.quantity} <br />
                            Price: ${convertCentsToUsd(item.price)} <br />
                          </p>
                        </td>

                        <td
                          style={{
                            overflowY: 'auto'
                          }}
                        >
                          {
                            item.licenseKeys.length <= 0 ? (
                              <p>No license found.</p>
                            ) : (
                              <div 
                                className={
                                  `d-flex flex-column 
                                  gap-1`
                                }
                              >
                                {
                                  item.licenseKeys.map((item, index) => (
                                    <div 
                                      key={`${Math.random()}-${index}`}
                                      className="d-flex gap-1 justify-content-between w-100"
                                    >
                                      <span>{item}</span>
                                      <Button
                                        variant="outline-dark"
                                        size="sm"
                                        onClick={() => {
                                          navigator.clipboard.writeText(item)
                                          showAppToast(rootContext, "License copied!")
                                        }}
                                      >
                                        <Clipboard />
                                      </Button>
                                    </div>
                                  ))
                                }
                              </div>
                            )
                          }
                        </td>
                      </Fragment>
                    ))
                  }
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>
                Total Amount: ${convertCentsToUsd(
                  order?.paymentInfo?.paymentAmount ?
                  order.paymentInfo.paymentAmount : 0
                )}
              </Card.Title>
            </Card.Header>

            <Card.Body>
              <ListGroup>
                <ListGroupItem>
                  Order Date & Time: 
                  {simpleDateTimeFormat(order?.orderDate)}
                </ListGroupItem>

                <ListGroupItem>
                  Order Status: {order?.orderStatus.toUpperCase()}
                </ListGroupItem>

                <ListGroupItem>
                  <div className="d-flex flex-column gap-1">
                    <span>Address Line1: {order?.customerAddress.line1}</span>
                    <span>Address Line2: {order?.customerAddress.line2}</span>
                    <span>City: {order?.customerAddress.city}</span>
                    <span>State: {order?.customerAddress.state}</span>
                    <span>Country: {order?.customerAddress.country}</span>
                    <span>Postal Code: {order?.customerAddress.postal_code}</span>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderPage