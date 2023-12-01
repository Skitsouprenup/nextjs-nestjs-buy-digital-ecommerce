'use client'

import { FC } from "react"

import Breadcrumb from "react-bootstrap/Breadcrumb"

interface PathObject {
  active: boolean
  href: string
  text: string
}

const Breadcrumbs:FC<{
  paths: Array<PathObject>
}> = ({ paths }) => {
  return (
    <Breadcrumb className="d-flex align-items-center pt-3">
      {
        paths.map((item, index) =>
          <Breadcrumb.Item 
            key={`${item.text}-${index}`}
            href={item.href}
            active={item.active}
          >
            {item.text}
          </Breadcrumb.Item>
        )
      }
    </Breadcrumb>
  )
}

export default Breadcrumbs