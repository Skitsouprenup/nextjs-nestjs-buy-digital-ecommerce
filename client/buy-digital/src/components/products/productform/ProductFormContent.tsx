'use client'

import { FC, useEffect, useState, useContext } from "react"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import InputGroup from "react-bootstrap/InputGroup"
import Table from "react-bootstrap/Table"
import TextField from "@/components/formfields/TextField"
import TextArea from "@/components/formfields/TextArea"
import Selection from "@/components/formfields/Selection"
import ListGroup from "react-bootstrap/ListGroup"
import { Check2Circle, Trash } from "react-bootstrap-icons"

import { useRouter } from "next/navigation"
import { productEndpoints } from "@/services/product.service"

import { showAppToast } from '@/utilities/apptoastutils'
import { RootContext } from 'context'
import { expiredToken } from "@/utilities/verificationutils"

const ProductFormContent:FC<{
  product: Record<string, unknown> | null
}> = ({ product }) => {
  const rootContext = useContext(RootContext)

  const [productForm, setProductForm] = useState<Record<string, unknown>>({})

  //spec = specification
  //desc = description
  const [specRam, setSpecRam] = useState<string>('')
  const [specProcessor, setSpecProcessor] = useState<string>('')
  const [specStorage, setSpecStorage] = useState<string>('')
  const [specList, setSpecList] = 
    useState<Array<Record<string, unknown>>>([])

  const [highlightsText, setHighlightsText] = useState<string>('')
  const [highlights, setHighlights] = useState<Array<string>>([])

  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const removeSpecification = (index: number) => {
    const specs = [...specList]
    specs.splice(index, 1)

    setSpecList([...specs])
  }

  const removeHighlights = (index: number) => {
    const list = [...highlights]
    list.splice(index, 1)

    setHighlights([...list])
  }

  const productFormkeyList = [
    'productName', 'description', 'category',
    'deviceType', 'platformType', 'productUrl',
    'downloadUrl', 'highlights', 'specification'
  ]

  const submitForm = async () => {

    const keys = Object.keys(productForm)

    if(!keys.length) {
      showAppToast(rootContext, 'Please fill-up all fields')
      return
    }

    if(!specList.length) {
      showAppToast(rootContext, 'Please add specification')
      return
    }

    const payload = productForm
    payload['specification'] = specList
    payload['highlights'] = highlights

    for(const item in payload) {
      if(!productFormkeyList.includes(item)) {
        showAppToast(rootContext, 'Please fill-up remaining fields')
        return
      }
    }

    try {
      setLoading(true)
      const { token } = JSON.parse(localStorage.getItem('user') as string)
      //console.log(token)
      const { success, message } = 
        !product ?
          await productEndpoints.
          createProduct(
            payload, 
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          ) :
          await productEndpoints.
          updateProduct(
            product?._id as string, 
            payload,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )

      if(success) {
        showAppToast(rootContext, message)
        router.push('/products')
      }
    }
    catch(error) {
      console.log(error)

      const errorData = error as 
        { response: { data: { exception: Record<string, unknown> } }}

      if(!expiredToken(
        errorData.response.data.exception?.name as string,
        rootContext
      )) showAppToast(rootContext, 'Something went wrong!')
    }
    finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    if(product) {
      const specification = 
        productForm?.specification as Array<Record<string, unknown>>
      const highlights = productForm?.highlights as Array<string>

      setProductForm(product)
      setSpecList(specification ? specification : [])
      setHighlights(highlights ? highlights : [])
    }

  }, [product, productForm])

  return (
    <Card>
      <h4 className="text-center pt-4">Product Details</h4>
      <hr />
      <Form>
        <Row className="p-2">
          {/* Left side section */}
          <Col
            sm="12"
            md="6" 
            className="d-flex flex-column gap-1"
          >
            <TextField
              controlId='productName' 
              label='Product Name'
              dataValue={productForm?.productName as string}
              dataName='productName'
              type='text'
              data={productForm} 
              setData={setProductForm} 
            />

            <TextArea
              controlId='productDescription' 
              label='Product Description'
              dataValue={productForm?.description as string}
              dataName='description'
              data={productForm} 
              setData={setProductForm}
            />

            <Form.Group>
              <Form.Label className="fw-bold">Product Requirements</Form.Label>
              <InputGroup className="d-flex flex-column">
                <Form.Group>
                  <Form.Label>RAM</Form.Label>
                  <Form.Control
                    value={specRam} 
                    type='text'
                    onChange={(e) => setSpecRam(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Processor</Form.Label>
                  <Form.Control
                    type='text'
                    value={specProcessor}
                    onChange={(e) => setSpecProcessor(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Storage</Form.Label>
                  <Form.Control
                    type='text'
                    value={specStorage}
                    onChange={(e) => setSpecStorage(e.target.value)}
                  />
                </Form.Group>

                <Button 
                className="mt-2"
                onClick={() => {
                  setSpecList([
                    ...specList, 
                    { 
                      RAM: specRam, 
                      Processor: specProcessor, 
                      Storage: specStorage
                    }
                  ])
                  setSpecRam('')
                  setSpecProcessor('')
                  setSpecStorage('')
                }}
                >
                  <Check2Circle />
                </Button>
              </InputGroup>
            </Form.Group>

            <div>
              <p className="text-center">Requirement Specification</p>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>RAM</th>
                    <th>Processor</th>
                    <th>Storage</th>
                    <th>Action/s</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    specList.length > 0 ? (
                      specList.map((item, index) => {
                        return (
                          <tr key={`${item.title}-${index}`}>
                            <td>{item.RAM as string}</td>
                            <td>{item.Processor as string}</td>
                            <td>{item.Storage as string}</td>
                            <td>
                              <Button 
                                className="btn btn-danger"
                                onClick={() => removeSpecification(index)}
                              >
                                <Trash />
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    ) : null
                  }
                </tbody>
              </Table>
            </div>
          </Col>

          {/* Right side section */}
          <Col
            sm="12"
            md="6" 
            className="d-flex flex-column gap-1"
          >
            <Selection 
              controlId='selectCategory'
              itemPlaceholder='Select Category'
              items={['Operating System', 'Application Software']} 
              label='Category'
              dataValue={productForm?.category as string}
              dataName='category'
              data={productForm} 
              setData={setProductForm}
            />

            <Selection 
              controlId='selectPlatform'
              itemPlaceholder='Select Platform'
              items={['Windows', 'IOS', 'Linux', 'MAC']} 
              label='Platform'
              dataValue={productForm?.platformType as string}
              dataName='platformType'
              data={productForm} 
              setData={setProductForm}
            />

            <Selection 
              controlId='selectDevice'
              itemPlaceholder='Select Device'
              items={['Computer', 'Mobile']} 
              label='Device'
              dataValue={productForm?.deviceType as string}
              dataName='deviceType'
              data={productForm} 
              setData={setProductForm}
            />

            <TextField
              controlId='productUrl' 
              label='Product URL'
              dataValue={productForm?.productUrl as string}
              dataName='productUrl'
              type='text'
              data={productForm} 
              setData={setProductForm} 
            />

            <TextField
              controlId='downloadUrl' 
              label='Download URL'
              dataValue={productForm?.downloadUrl as string}
              dataName='downloadUrl'
              type='text'
              data={productForm} 
              setData={setProductForm} 
            />

            <Form.Group>
              <Form.Label className="fw-bold">Product Highlights</Form.Label>
              <InputGroup>

                <Form.Group className="w-100">
                  <Form.Label>Highlights</Form.Label>
                  <div className="d-flex gap-1">
                    <Form.Control
                      type='text'
                      className="flex-1"
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        setHighlights([...highlights, highlightsText])
                        setHighlightsText('')
                      }}
                    >
                      <Check2Circle />
                    </Button>
                  </div>
                </Form.Group>

              </InputGroup>
            </Form.Group>
            <p className="pt-2">
              Product highlights are listed below.
            </p>
            {
              !highlights.length ? <p>No Highlights Added</p> :
              <ListGroup>
                {
                  highlights.map((item, index) => (
                    <ListGroup.Item 
                      className="d-flex justify-content-between align-items-center"
                      key={`${item}-${index}`}
                    >
                      {item}
                      <Button
                        variant="danger"
                        onClick={() => removeHighlights(index)}
                      >
                        <Trash />
                      </Button>
                    </ListGroup.Item>
                  ))
                }
              </ListGroup>
            }
          </Col>
        </Row>

        <Row className="p-2">
          <Col className="d-flex gap-2 justify-content-end">
            {
              loading ? <h6>Loading...</h6> :
              <>
                <Button
                  onClick={() => router.push('/products')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="success"
                  onClick={submitForm}
                >
                  { !product ? 'Create' : 'Update' }
                </Button>
              </>
            }
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default ProductFormContent