import React, { FunctionComponent } from 'react'
import { v4 as uuid } from 'uuid'
import { ApolloProvider } from './ApolloProvider'
import { useContext } from 'react'
import { IBrainstormBridge, initialBrainstormBridge, _dangerouslyGetBrainstormBridge } from '../helpers/buildBrainstormBridge'
import { IReactComponentProps } from './metadata'

export interface IAppContext extends IBrainstormBridge {

}

export const AppContext = React.createContext<IAppContext>({
  ...initialBrainstormBridge,
})

export function useAppContext() {
  return useContext(AppContext)
}

interface IBrainstormProps extends IReactComponentProps {

}

export class Brainstorm extends React.Component<IBrainstormProps> {
  id: string

  constructor (props: IBrainstormProps) {
    super(props)
    this.id = uuid()
    this.state = { shouldRender: {} }
  }

  componentDidMount() {
    // subscriptions.set(this.id, () => {
    //   this.setState(() => ({ shouldRender: {} }))
    // })
  }

  componentWillUnmount() {
    // subscriptions.delete(this.id)
  }

  render () {
    const appContext = _dangerouslyGetBrainstormBridge()
    console.log('Brainstorm')

    return (
      <ApolloProvider>
        <AppContext.Provider value={appContext}>
          {this.props.children}
        </AppContext.Provider>
      </ApolloProvider>
    )
  }
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
