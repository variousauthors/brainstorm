import React, { MouseEventHandler, useState } from 'react'
import tw from 'tailwind-styled-components'
import { isDefined } from '@atoms/helpers'

const _Button = tw.button`
    w-full 
    sm:w-auto 
    color-blue 
    mt-6 
    bg-gray-200 
    hover:bg-gray-300 
    text-sm 
    py-2 
    px-6 
    transition 
    duration-150 
    ease-in-out 
    rounded
`

export interface IButtonProps {
    text?: string,
    primary?:boolean,
    disabled?: boolean,
    size?: 'small' | 'medium' | 'large',
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export function Button({ text }: IButtonProps) {
  const [state, setState] = useState(1)

  const handleClick = () => {
    setState(state + 1)
  }

  return (
    <_Button className="" onClick={handleClick}>
      {isDefined(text) ? text : 'Send Message' }
    </_Button>
  )
}
