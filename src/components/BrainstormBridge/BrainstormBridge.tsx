import React from 'react'
import { IBrainstormBridge, _dangerouslyUpdateBrainstormBridge } from "../../helpers/buildBrainstormBridge";

interface IBrainstormBridgeProps extends Partial<IBrainstormBridge> {
  
}

export function BrainstormBridge (props: IBrainstormBridgeProps) {
  _dangerouslyUpdateBrainstormBridge((prev) => {
    return {
      ...prev,
      ...props,
    }
  })

  return (<></>)
}