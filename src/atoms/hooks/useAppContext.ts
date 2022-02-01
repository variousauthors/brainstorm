import { useContext } from 'react'
import { AppContext } from '@atoms/_entry'

export function useAppContext() {
  return useContext(AppContext)
}
