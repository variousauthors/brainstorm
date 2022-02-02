import * as React from 'react'
import styled from 'styled-components'

const ClickablePart = styled.div`
  margin-left: 4px;
`

const WhiteSaltire = styled.span`
  fill: #fff;
  width: 9px;
`

export function IconCloseClickable (props: { onClick: (e: React.MouseEvent<HTMLDivElement>) => void }) {
  return (
    <ClickablePart onClick={props.onClick}>
      <WhiteSaltire/>
    </ClickablePart>
  )
}

export const Item = styled.div`
  display: flex;
  align-items: center;

  border-radius: 15px/15px;
  color: #fff;
  height: 30px;
  white-space: nowrap;
  background: blue;
  padding: 0 8px;

  margin-bottom: 0px;

  &:not(:last-child) {
    margin-right: 0px;
  }
`
