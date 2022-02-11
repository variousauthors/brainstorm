import { AutoForm } from 'uniforms/esm'

import ValidatedQuickForm from './ValidatedQuickForm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Auto(parent: any) {
  class _ extends AutoForm.Auto(parent) {
    static Auto = Auto
  }

  return _ as unknown as AutoForm
}

export default Auto(ValidatedQuickForm)