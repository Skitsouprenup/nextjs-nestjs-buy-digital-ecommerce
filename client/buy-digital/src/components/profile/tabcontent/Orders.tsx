"use client"

import { convertCentsToUsd, getUserInfoInLocalStorage, tokenExpiredOrSomethingElse } from "@/utilities/utilities"
import { FC, useContext, useEffect, useState } from "react"

import { RootContext } from "context"
import { useRouter } from "next/navigation"
import { ordersEndpoints } from "@/services/orders.service"

import Table from "react-bootstrap/Table"
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { OrderProperties } from "@/types/orders/orderstypings"
import Link from "next/link"
import { Button } from "react-bootstrap"

const Orders:FC<{
  orderId: string
}> = ({ orderId }) => {
  const rootContext = useContext(RootContext)
  const router = useRouter()

  const[orders, setOrders] = useState<Array<OrderProperties>>([])
  const[loading, setLoading] = useState<boolean>(true)

  const fetchOrders = async (status: string | null) => {
    const userInfo = getUserInfoInLocalStorage(rootContext, router)

    try {
      const headers = {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${userInfo?.token}`
        }
      }

      const { success, content } = 
        await ordersEndpoints.fetchOrdersOfUser(headers, status)

      if(success) {
        setOrders(content)
      }
    }
    catch(error) {
      console.error(error)
      tokenExpiredOrSomethingElse(error, rootContext)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(loading)
    return <h6>Loading...</h6>

  return (
    <div>
      <div className="d-flex justify-content-end">
        <DropdownButton
          variant="outline-primary"
          title="Status"
          onSelect={(e) => fetchOrders(e)}
        >
          <Dropdown.Item eventKey="">
            All
          </Dropdown.Item>

          <Dropdown.Item eventKey="pending">
            Pending
          </Dropdown.Item>

          <Dropdown.Item eventKey="completed">
            Completed
          </Dropdown.Item>
        </DropdownButton>
      </div>
      {
        orders.length <= 0 ? (
          <h6>No Orders Found!</h6>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {
                orders.map((item) => (
                  <tr key={item._id}>
                    <td>{item.orderId}</td>
                    <td>
                      {new Date(item.orderDate.toString()).toLocaleDateString()}
                    </td>
                    <td>{item.orderStatus.toUpperCase()}</td>
                    <td>{`$${convertCentsToUsd(item.paymentInfo.paymentAmount)}`}</td>
                    <td>
                      <Link href={`/orders/${item._id}`}>
                        <Button
                          variant="outline-success"
                        >
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        )
      }
    </div>
  )
}

export default Orders