
export interface IBrainstormBridge {
  t: (str: string) => string
  store: {
    state: Record<string, unknown>
    actions: Record<string, unknown>
  },
}

export const initialBrainstormBridge: IBrainstormBridge = {
  t: (str: string) => str,
  store: { state: {}, actions: {} },
}

const _brainstormBridge: IBrainstormBridge = {
  ...initialBrainstormBridge,
}

export function _dangerouslyGetBrainstormBridge() {
  return _brainstormBridge
}

export function _dangerouslyUpdateBrainstormBridge(next: (prev: IBrainstormBridge) => IBrainstormBridge): void {
  Object.assign(_brainstormBridge, {
    ...next(_brainstormBridge),
  })
}