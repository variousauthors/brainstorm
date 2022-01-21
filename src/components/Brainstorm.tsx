import React, { FunctionComponent } from 'react'
import { PropsWithChildren } from 'react'
import { ApolloProvider } from './ApolloProvider'
import { useContext } from 'react'
import { IBrainstormBridge, initialBrainstormBridge, _dangerouslyGetBrainstormBridge } from '../helpers/buildBrainstormBridge'

export interface IAppContext extends IBrainstormBridge {

}

export const AppContext = React.createContext<IAppContext>({
  ...initialBrainstormBridge,
})

export function useAppContext() {
  return useContext(AppContext)
}

export function brainstorm<T> (Component: FunctionComponent<T>) {
  const component: FunctionComponent<T> = (props: T) => (
    <Brainstorm>
      <Component {...props} />
    </Brainstorm>
  )

  component.displayName = Component.displayName

  return component
}

export function Brainstorm ({ children }: PropsWithChildren<unknown>) {
  const brainstormBridge = _dangerouslyGetBrainstormBridge()

  const appContext = {
    ...brainstormBridge,
  }

  return (
    <ApolloProvider>
      <AppContext.Provider value={appContext}>
        {children}
      </AppContext.Provider>
    </ApolloProvider>
  )
}