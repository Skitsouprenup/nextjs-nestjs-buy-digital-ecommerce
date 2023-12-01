import { FC } from 'react'

import Form from 'react-bootstrap/Form'

const TextField: 
  FC<{
    controlId: string,
    label: string,
    dataValue: string,
    dataName: string,
    type: "text" | "email" | "password",
    data: Record<string, unknown>, 
    setData: Function,
    disabled?: boolean
  }> = 
  ({
    controlId, 
    label, 
    dataValue, 
    dataName, 
    type, 
    data, 
    setData, 
    disabled = false
  }) => {

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        value={dataValue ? dataValue : ''} 
        type={type}
        disabled={disabled}
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

export default TextField