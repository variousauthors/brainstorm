import React, { } from 'react'
import { Words } from '@atoms/components'
import { IReactComponentProps } from '@atoms/metadata'
import Ajv from 'ajv'
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'
import { isNil } from '@atoms/helpers'
import { Form } from '../FormStuff'

const schema = {
  title: 'Guest',
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    birthday: { type: 'string', format: 'date-time' },
    phoneNumber: { type: 'string' },
    gender: {
      type: 'string', // the type here should be a type-guard isGender
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    position: { type: 'string' },
  },
  required: ['firstName', 'lastName'],
}

const ajv = new Ajv({ allErrors: true, useDefaults: true })

function createValidator(schema: object) {
  const validator = ajv.compile(schema)

  return (model: object) => {
    void validator(model)
    return isNil(validator.errors?.length) ? { details: validator.errors } : undefined
  }
}

const schemaValidator = createValidator(schema)

export const bridge = new JSONSchemaBridge(schema, schemaValidator)


export interface IProfileFormProps extends IReactComponentProps {
  userProfile: { firstName: string }
  onChange: (userProfile: { firstName: string }) => void
  onSubmit: () => void
}

export function ProfileForm (props: IProfileFormProps) {
  return (
    <div className="element-wrapper">
      <div className="element-box">
        <div className="element-info">
          <div className="element-info-with-icon">
            <div className="element-info-icon">
              <div className="os-icon os-icon-cv-2"></div>
            </div>
            <div className="element-info-text">
              <Words className='element-inner-header'>agents:PERSONAL_SETTINGS.PROFILE.TITLE</Words>
              <Words className='element-inner-desc'>agents:PERSONAL_SETTINGS.PROFILE.DESCRIPTION</Words>
            </div>
          </div>
        </div>
        <Form schema={bridge} onSubmit={console.log} />
        <div className="form-buttons-w text-right">
          <button onClick={props.onSubmit} type="button" className="btn btn-primary">
            <Words>agents:GLOBAL.SAVE</Words>
          </button>
        </div>
      </div>
    </div>
  )
}