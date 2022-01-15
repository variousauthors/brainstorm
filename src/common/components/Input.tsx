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

export const Input = ({id, disabled, label, message, error, success, onChange, placeholder, value, ...props}: InputProps) => {
    return (
      <div>Hello</div>
    )
}