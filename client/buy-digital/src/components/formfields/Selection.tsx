import { FC } from "react"
import Form from "react-bootstrap/Form"

const Selection:FC<{
  controlId: string,
  itemPlaceholder: string,
  items: Array<string>,
  label: string,
  dataValue: string,
  dataName: string,
  data: Record<string, any>, 
  setData: Function,
}> = ({controlId, itemPlaceholder, items, label, dataValue, dataName, data, setData}) => {
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        aria-label={label}
        value={dataValue ? dataValue : ''} 
        onChange={
          (e) => setData(
            {
              ...data, 
              [dataName]: e.target.value
            }
          )
        }
      >
        <option value=''>{itemPlaceholder}</option>
        {
          items.map((item) => <option value={item} key={item}>
              {item}
            </option>
          )
        }
      </Form.Select>
    </Form.Group>
  )
}

export default Selection