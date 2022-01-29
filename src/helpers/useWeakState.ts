import { useState, useEffect, Dispatch, SetStateAction } from 'react'

/** this hook is here to solve the problem of a useState
 * ignoring new changes to props, but listen:
 *
 * Nine times out of ten the problem can be solved more elegantly by
 * moving state to the parent. Please, please only use this
 * when the state makes no sense in the parent.
 *
 * This causes an extra render on every change to props, so
 * also please, please only use this in LEAF nodes. That is,
 * only use this in components that DO NOT render any components.
 *
 * As of this writing (2020-06-10) I am looking into other solutions.
 */
export function useWeakState <T>(strongValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [weakState, setWeakState] = useState(strongValue)

  useEffect(() => {
    setWeakState(strongValue)
  }, [strongValue])

  return [weakState, setWeakState]
}
