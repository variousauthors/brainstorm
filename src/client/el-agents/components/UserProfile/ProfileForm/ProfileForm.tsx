import React, { } from 'react'
import { Words } from '@atoms/components'
import { IReactComponentProps } from '@atoms/metadata'
import { useDebounce, useWeakState } from '@common/helpers'
import Ajv from 'ajv'
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'
import { isNil } from '@atoms/helpers'
import { AutoForm } from '../FormStuff'

const schema = {
  title: 'Guest',
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    workExperience: {
      description: 'Work experience in years',
      type: 'integer',
      minimum: 0,
      maximum: 100,
    },
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
  const [userProfile, setUserProfile] = useWeakState(props.userProfile)

  const onChange = useDebounce(props.onChange, 200, [])

  function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
    const next = { ...props.userProfile, firstName: e.target.value }

    setUserProfile(next)
    onChange(next)
  }

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
        <AutoForm schema={bridge} onSubmit={console.log} />
        <div className='VFG'>
          <div className='vue-form-generator'>
            <fieldset>
              <div className='form-group valid required col-sm-6 field-input'>
                <label htmlFor="field-firstName">
                  <Words>agents:PERSONAL_SETTINGS.PROFILE.FIELDS.FIRST_NAME</Words>
                </label>
                <div className="field-wrap">
                  <div className="wrapper">
                    <input
                      id="field-firstName"
                      type="text"
                      className="form-control"
                      value={userProfile.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="form-buttons-w text-right">
          <button onClick={props.onSubmit} type="button" className="btn btn-primary">
            <Words>agents:GLOBAL.SAVE</Words>
          </button>
        </div>
      </div>
    </div>
  )
}