import { Words } from '@atoms/components'
import React, { HTMLProps, Ref } from 'react'
import { Override, filterDOMProps, useForm } from 'uniforms'

export type SubmitFieldProps = Override<
  HTMLProps<HTMLInputElement>,
  { inputRef?: Ref<HTMLInputElement>; value?: string }
>;

export default function SubmitField({
  disabled,
  inputRef,
  readOnly,
  value,
  ...props
}: SubmitFieldProps) {
  const { error, state } = useForm()

  return (
    <div className='form-buttons-w text-right'>
      <button
        className='btn btn-primary'
        disabled={disabled === undefined ? !!(error || state.disabled) : disabled}
        readOnly={readOnly}
        ref={inputRef}
        type="submit"
        {...(value ? { value } : {})}
        {...filterDOMProps(props)}
      >
        <Words>agents:GLOBAL.SAVE</Words>
      </button>
    </div>
  )
}
