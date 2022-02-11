import { BaseForm } from 'uniforms'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Unstyled(parent: any) {
  class _ extends parent {
    static Unstyled = Unstyled

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    static displayName = `Unstyled${parent.displayName}`
  }

  return _ as unknown as typeof BaseForm
}

export default Unstyled(BaseForm)
