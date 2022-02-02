import * as React from 'react'
import { isDefined } from '@atoms/helpers'
import { doesDOMNodeContainEventTarget } from '@common/helpers'

export interface IClickOutsideProps<T> extends React.HTMLAttributes<T> {
  onClickOutside?: () => void

  className?: string
}

type ReactEventOrNativeEvent<T> = Event | React.MouseEvent<T>

export class ClickOutside<T> extends React.PureComponent<IClickOutsideProps<T>> {
  private ref: React.RefObject<HTMLDivElement>

  constructor (props: IClickOutsideProps<T>) {
    super(props)

    this.ref = React.createRef<HTMLDivElement>()
    this.handleClick = this.handleClick.bind(this)
  }

  UNSAFE_componentWillMount () {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount () {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    document.removeEventListener('mousedown', this.handleClick)
  }

  handleClickOutside () {
    if (isDefined(this.props.onClickOutside)) {
      this.props.onClickOutside()
    }
  }

  /** listen for events from react OR from the DOM */
  handleClick (e: ReactEventOrNativeEvent<HTMLDivElement>) {
    const node = this.ref.current
    const target = e.target

    if (doesDOMNodeContainEventTarget(target, node)) {
      return
    }

    this.handleClickOutside()
  }

  render () {
    return (
      <div ref={this.ref} className={this.props.className}>
        {this.props.children}
      </div>
    )
  }
}
