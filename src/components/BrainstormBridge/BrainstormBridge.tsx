import React, { } from 'react'
import { IBrainstormBridge, _dangerouslyUpdateBrainstormBridge } from '../../helpers/buildBrainstormBridge'

export const subscriptions: Map<string, () => void> = new Map()

interface IBrainstormBridgeProps extends Partial<IBrainstormBridge> {

}

// whenever brainstorm bridge updates, we want all the Brainstorms everywhere to update
// whenever a brainstorm is mounted or unmounted we want it to subscribe/unscubscribe

export class BrainstormBridge extends React.Component<IBrainstormBridgeProps> {

  componentDidUpdate() {
    // subscriptions.forEach((handler) => {
    //   handler()
    // })

    _dangerouslyUpdateBrainstormBridge((prev) => {
      return {
        ...prev,
        ...this.props,
      }
    })
  }

  render () {
    return (<></>)
  }
}
