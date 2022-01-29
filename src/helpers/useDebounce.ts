import { useMemo } from 'react'
import { DebouncedFunc, debounce } from 'lodash'


export function useDebounce<T>(fn: (...args: T[]) => void, wait: number, deps: React.DependencyList): DebouncedFunc<(...args: T[]) => void> {
  return useMemo(
    () => debounce(fn, wait),
    deps,
  )
}