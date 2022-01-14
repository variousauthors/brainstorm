import React,{FC, useState} from 'react'
import { MouseEventHandler } from "react"
import styled from 'styled-components'

const _Button = styled.button`
    background-color: blue;
    color: white;
    border: 1px solid black;
    border-radius: 5px;
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
        <button className="w-full sm:w-auto color-blue mt-6 bg-gray-200 hover:bg-gray-300 text-sm py-2 px-6 transition duration-150 ease-in-out rounded">
            {text ? text : 'Send Message' }
        </button>
    )
}
