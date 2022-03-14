import React from 'react'
import { IReactComponentProps } from '@atoms/metadata'
import { Bridge, DeepPartial } from 'uniforms'
import AutoForm from './AutoForm'
import AutoFields from './AutoFields'
import ErrorsField from './ErrorsField'
import SubmitField from './SubmitField'

function CustomAutoFields(props: IReactComponentProps) {
  return (
    <div className='VFG'>
      <div className='vue-form-generator'>
        <fieldset>
          {props.children}
        </fieldset>
      </div>
    </div>
  )
}

interface IFormProps extends IReactComponentProps {
  schema: Bridge
  model: DeepPartial<unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (model: DeepPartial<unknown>) => void | Promise<any>
}

export function Form (props: IFormProps) {
  return (
    <AutoForm schema={props.schema} onSubmit={props.onSubmit} model={props.model}>
      <AutoFields element={CustomAutoFields} />
      <ErrorsField />
      <SubmitField />
    </AutoForm>
  )
}