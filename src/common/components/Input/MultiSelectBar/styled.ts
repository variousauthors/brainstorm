import styled from 'styled-components'

export const borderStyles = `
  border: 1px solid #DFE3E5;
  border-radius: 2px;
`

// Styles
export const InputLikeBar = styled.div`
  ${borderStyles}
  min-height: 40px;
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
  transition: border-color .3s ease-in-out;

  display: flex;
  align-items: center;
`

export const InputLikeBarArrow = styled.span`
  position: absolute;
  right: 10px;
  width: 10px;
  fill: gray;
`

export const InputLikeBarItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  padding-top: 0px;
`

export const Placeholder = styled.div`
  color: gray;
`
