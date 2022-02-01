import React, { FunctionComponent } from 'react'
import { v4 as uuid } from 'uuid'
import { IReactComponentProps } from '@atoms/metadata'
import { IBrainstormBridge, initialBrainstormBridge, _dangerouslyGetBrainstormBridge } from './buildBrainstormBridge'
import { ApolloProvider } from './ApolloProvider'

export interface IAppContext extends IBrainstormBridge {

}

export const AppContext = React.createContext<IAppContext>({
  ...initialBrainstormBridge,
})

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
