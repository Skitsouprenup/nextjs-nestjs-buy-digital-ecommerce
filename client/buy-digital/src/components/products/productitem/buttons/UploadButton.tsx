import { FC } from "react"
import { Upload } from "react-bootstrap-icons"

import Button from "react-bootstrap/Button"

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

const UploadButton:
FC<{
  setModalType: Function
}> = ({ setModalType }) => {

  const renderTooltip = (props: Record<string, unknown>) => (
    <Tooltip id="button-tooltip" {...props}>
      Upload Cover Image
    </Tooltip>
  );

  return (
    <div>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 300 }}
        overlay={renderTooltip}
      >
        <Button 
          className={`
            btn btn-outline-dark btn-light 
            d-flex align-items-center gap-1 p-1
          `}
          onClick={() => setModalType('upload')}
        >
          <Upload />
        </Button>
     </OverlayTrigger>
    </div>
  )
}

export default UploadButton