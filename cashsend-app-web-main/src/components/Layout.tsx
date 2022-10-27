import React from 'react'
import { Wrapper } from './Wrapper'

interface LayoutProps {
  showNav?: boolean
  showFooter?: boolean
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  // showNav = true,
  // showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* <Nav showNav={showNav} /> */}
      <Wrapper>{children}</Wrapper>
      {/* <Footer showFooter={showFooter} /> */}
    </div>
  )
}
