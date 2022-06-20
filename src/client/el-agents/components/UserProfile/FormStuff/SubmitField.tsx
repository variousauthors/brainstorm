import { Words } from '@atoms/components'
import React, { HTMLProps, Ref } from 'react'
import { Override, filterDOMProps, useForm } from 'uniforms'

function isNil<T>(value: T | undefined): value is T {
  return value !== undefined
}

export type SubmitFieldProps = Override<
  HTMLProps<HTMLInputElement>,
  { inputRef?: Ref<HTMLInputElement>; value?: string }
>;

export default function SubmitField({
  disabled,
  inputRef,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readOnly,
  value,
  ...props
}: SubmitFieldProps) {
  const form = useForm()
  const { state } = form

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buttonProps: any = {
    ...(!isNil(value) ? { value } : {}),
    ...filterDOMProps(props),
  }

  return (
    <div className='form-buttons-w text-right'>
      <button
        { ...buttonProps }
        className='btn btn-primary'
        disabled={disabled === undefined ? !!(!isNil(form.error) ? form.error : state.disabled) : disabled}
        type='submit'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        ref={inputRef as any}
      >
        <Words>agents:GLOBAL.SAVE</Words>
      </button>
    </div>
  )
}
