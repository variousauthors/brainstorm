import React, { useState } from 'react'
import { MouseEventHandler } from "react"
import tw from "tailwind-styled-components"

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

export interface ButtonProps {
    text?: string,
    primary?:boolean,
    disabled?: boolean,
    size?: "small" | "medium" | "large",
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export function Button ({size, primary, disabled, text, ...props}: any) {
    const [state, setState] = useState(1)

    const handleClick = () => {
        setState(state + 1);
    }

    return (
        <_Button className="" onClick={handleClick}>
            {text ? text : 'Send Message' }
        </_Button>
    )
}
