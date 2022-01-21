import React from 'react'
import { ChangeEventHandler } from 'react'

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

export const Input = () => {
  return (
    <div>Hello</div>
  )
}