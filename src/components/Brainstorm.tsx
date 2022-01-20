import React from "react";
import { PropsWithChildren } from "react";
import { ApolloProvider } from "./ApolloProvider";
import { useContext } from 'react'
import { IBrainstormBridge, initialBrainstormBridge, _dangerouslyGetBrainstormBridge } from "../helpers/buildBrainstormBridge";

export interface IAppContext extends IBrainstormBridge {

}

export const AppContext = React.createContext<IAppContext>({
  ...initialBrainstormBridge,
})

export function useAppContext() {
  return useContext(AppContext)
}

export function brainstorm<T> (Component: (props: T) => JSX.Element) {
  return (props: T) => (
    <Brainstorm>
      <Component {...props} />
    </Brainstorm>
  )
}

export function Brainstorm ({ children }: PropsWithChildren<{}>) {
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