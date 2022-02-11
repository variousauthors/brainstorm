import { assertNever } from '@atoms/helpers'
import { createAutoField } from 'uniforms'
export { AutoFieldProps } from 'uniforms'

import BoolField from './BoolField'
import DateField from './DateField'
import ListField from './ListField'
import NestField from './NestField'
import NumField from './NumField'
import RadioField from './RadioField'
import SelectField from './SelectField'
import TextField from './TextField'

const AutoField = createAutoField((props) => {
  console.log('wat', props)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (props.allowedValues) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return props.checkboxes && props.fieldType !== Array
      ? RadioField
      : SelectField
  }

  switch (props.fieldType) {
    case Array:
      return ListField
    case Boolean:
      return BoolField
    case Date:
      return DateField
    case Number:
      return NumField
    case Object:
      return NestField
    case String:
      return TextField
    default: assertNever(props.fieldType as never)
  }
})

export default AutoField
