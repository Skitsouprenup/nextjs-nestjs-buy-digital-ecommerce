'use client'

import { FC } from 'react'
import Tab from 'react-bootstrap/Tab'

const CustomTabContent: FC<{
  tabKey: string,
  children: React.ReactNode
}> = ({ tabKey, children }) => {
  return (
    <>
      <Tab.Pane eventKey={tabKey}>
        {children}
      </Tab.Pane>
    </>
  )
}

export default CustomTabContent