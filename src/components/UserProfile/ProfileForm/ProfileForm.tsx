import { useDraft } from '../../../helpers'
import React, { useMemo } from 'react'
import { IReactComponentProps } from '../../metadata'
import { Text } from '../../Typography'
import { debounce, DebouncedFunc } from 'lodash'

export interface IProfileFormProps extends IReactComponentProps {
  userProfile: { firstName: string }
  onChange: (userProfile: { firstName: string }) => void
  onSubmit: () => void
}

function useDebounce<T>(fn: (...args: T[]) => void, wait: number, deps: React.DependencyList): DebouncedFunc<(...args: T[]) => void> {
  return useMemo(
    () => debounce(fn, wait),
    deps,
  )
}

export function ProfileForm (props: IProfileFormProps) {
  console.log('ProfileForm')

  const onPublish = useDebounce((userProfile: { firstName: string }) => {
    props.onChange(userProfile)
  }, 500, [])

  const { draft, handleDraftChange, handlePublish } = useDraft({
    source: props.userProfile,
    onPublish,
  })


  function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
    const next = { ...props.userProfile, firstName: e.target.value }

    handleDraftChange(next)
    handlePublish()
  }

  return (
    <div className="element-wrapper">
      {props.userProfile.firstName}
      <div className="element-box">
        <div className="element-info">
          <div className="element-info-with-icon">
            <div className="element-info-icon">
              <div className="os-icon os-icon-cv-2"></div>
            </div>
            <div className="element-info-text">
              <Text className='element-inner-header'>agents:PERSONAL_SETTINGS.PROFILE.TITLE</Text>
              <Text className='element-inner-desc'>agents:PERSONAL_SETTINGS.PROFILE.DESCRIPTION</Text>
            </div>
          </div>
        </div>
        <div className='VFG'>
          <div className='vue-form-generator'>
            <fieldset>
              <div className='form-group valid required col-sm-6 field-input'>
                <label htmlFor="field-firstName">
                  <Text>agents:PERSONAL_SETTINGS.PROFILE.FIELDS.FIRST_NAME</Text>
                </label>
                <div className="field-wrap">
                  <div className="wrapper">
                    <input
                      id="field-firstName"
                      type="text"
                      className="form-control"
                      value={draft.firstName}
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
            <Text>agents:GLOBAL.SAVE</Text>
          </button>
        </div>
      </div>
    </div>
  )
}