import React,{FC, useState} from 'react'
import { MouseEventHandler } from "react"
import styled from 'styled-components'

const _Button = styled.button`
    background-color: blue;
    color: white;
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
        <_Button type="button" onClick={handleClick} primary={primary} disabled={disabled} size={size} {...props}>
            {"It Works maybe?"}
        </_Button>
    )
}
