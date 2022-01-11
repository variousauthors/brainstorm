import React, { FC,Fragment } from 'react'
import { ChangeEventHandler } from "react"

export interface InputProps {
  value?: string
  id?: string,
  label?: string,
  error?: boolean,
  message?: string,
  success?: boolean,
  disabled?: boolean,
  placeholder?: string,
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const Input: FC<InputProps> = ({id, disabled, label, message, error, success, onChange, placeholder, value, ...props}) => {
    return (
      <div>Hello</div>
    )
}