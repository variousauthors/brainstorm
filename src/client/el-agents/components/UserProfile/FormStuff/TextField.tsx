import React, { Ref } from 'react';
import { HTMLFieldProps, connectField, filterDOMProps } from 'uniforms';

export type TextFieldProps = HTMLFieldProps<
  string,
  HTMLDivElement,
  { inputRef?: Ref<HTMLInputElement> }
>;

function Text({
  autoComplete,
  disabled,
  id,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  readOnly,
  type,
  value,
  ...props
}: TextFieldProps) {
  console.log('TextField')
  return (
    <div className={'form-group valid required col-sm-6 field-input'} {...filterDOMProps(props)}>
      {label && <label htmlFor={id}>{label}</label>}

      <div className='field-wrap'>
        <div className='wrapper'>
          <input
            className='form-control'
            autoComplete={autoComplete}
            disabled={disabled}
            id={id}
            name={name}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            ref={inputRef}
            type={type}
            value={value ?? ''}
          />
        </div>
      </div>
    </div>
  );
}

Text.defaultProps = { type: 'text' };

export default connectField<TextFieldProps>(Text, { kind: 'leaf' });
