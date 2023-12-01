import { FC } from "react"


const RequirementsContent:FC<{
  requirements: Array<Record<string, unknown>>
}> = ({ requirements }) => {

  if(requirements.length === 0) {
    return <h4>No Specification Found.</h4>
  }

  return (
    <div className="d-flex flex-column gap-2">
      {
        requirements.map((item, index) => (
          <div 
            className="d-flex flex-column gap-2" 
            key={`${Math.random()}-${index}`}
          >
            <h5>Requirement #{index + 1}</h5>

            <div className="d-flex gap-2">
              <h6 style={{lineHeight: '24px'}}>
                RAM:
              </h6>
              <span>{item?.RAM as string}</span>
            </div>

            <div className="d-flex gap-2">
              <h6 style={{lineHeight: '24px'}}>
                Processor:
              </h6>
              <span>{item?.Processor as string}</span>
            </div>

            <div className="d-flex gap-2">
              <h6 style={{lineHeight: '24px'}}>
                Storage:
              </h6>
              <span>{item?.Storage as string}</span>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default RequirementsContent