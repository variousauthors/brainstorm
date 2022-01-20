
export interface IBrainstormBridge {
  t: (str: string) => string
}

export const initialBrainstormBridge: IBrainstormBridge = {
  t: (str: string) => str
}

let _brainstormBridge: IBrainstormBridge = {
  ...initialBrainstormBridge,
}

export function _dangerouslyGetBrainstormBridge() {
  return _brainstormBridge
}

export function _dangerouslyUpdateBrainstormBridge(next: (prev: IBrainstormBridge) => IBrainstormBridge): void {
  _brainstormBridge = {
    ..._brainstormBridge,
    ...next(_brainstormBridge)
  }
}