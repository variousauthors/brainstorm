import * as React from 'react'
import { mount } from 'enzyme'
import { ClickOutside } from './ClickOutside'

describe('ClickOutside', () => {

  it('calls the given handler when the user clicks outside', () => {
    const onClickOutside = jest.fn()
    const onClick = jest.fn()

    const subject = mount(<div>
      <ClickOutside onClickOutside={onClickOutside}>
        <button onClick={onClick}></button>
      </ClickOutside>
    </div>)

    document.dispatchEvent(new Event('mousedown'))

    expect(onClickOutside).toBeCalled()
  })

  it('ignores clicks inside', () => {
    const onClickOutside = jest.fn()
    const onClick = jest.fn()

    const subject = mount(<div>
      <ClickOutside onClickOutside={onClickOutside}>
        <button onClick={onClick}></button>
      </ClickOutside>
    </div>)

    document.dispatchEvent(new Event('mousedown'))

    expect(onClick).not.toBeCalled()
  })

  it('does not obscure event handling going on inside', () => {
    const onClickOutside = jest.fn()
    const onClick = jest.fn()

    const subject = mount(<div>
      <ClickOutside onClickOutside={onClickOutside}>
        <button onClick={onClick}></button>
      </ClickOutside>
    </div>)

    subject.find('button').simulate('click')

    expect(onClickOutside).not.toBeCalled()
    expect(onClick).toBeCalled()
  })
})