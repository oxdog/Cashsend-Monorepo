import React from 'react'

export type WrapperVariant = 'regular' | 'small'

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="mx-auto w-full">{children}</div>
}
