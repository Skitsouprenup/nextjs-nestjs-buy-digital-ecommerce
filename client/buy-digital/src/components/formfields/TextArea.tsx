import { FC } from 'react'

import Form from 'react-bootstrap/Form'

const TextArea: 
  FC<{
    controlId: string,
    label: string,
    dataValue: string,
    dataName: string,
    data: Record<string, any>, 
    setData: Function,
  }> = 
  ({controlId, label, dataValue, dataName, data, setData}) => {

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as='textarea'
        value={dataValue ? dataValue : ''} 
        onChange={
          (e) => setData(
            {
              ...data, 
              [dataName]: e.target.value
            }
          )
        }
      />
    </Form.Group>
  )
}

export default TextArea