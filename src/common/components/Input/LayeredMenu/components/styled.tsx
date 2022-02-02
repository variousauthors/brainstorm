import styled from 'styled-components'

export const DropdownContainer = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  z-index: 100;

  background: #fff;
  border: 1px solid lightgrey;
  border-radius: 2px;
  margin-top: 2px;
  width: 100%;
  padding: 2px;
  box-shadow: 2px 2px 0px 0px rgba(0,0,0,.05);
  max-height: 250px;
  overflow: auto;
  position: absolute;
`

export const MenuItem = styled.button`
  min-height: 30px;

  display: flex;
  width: 100%;
  padding: 10px;
  border: none;

  color: grey;

  &:hover {
    background: lightgrey;
    color: grey;
    border: none;
  }
`

export const MenuCategoryItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  .hover-text {
    display: none;
    color: grey;
    font-size: small;
  }

  &:hover {
    .hover-text {
      display: inline-block;
    }
  }
`

export const MenuBranchItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    fill: grey;
    flex: 0 0 10px;
  }
`

export const MenuLeafItem = styled(MenuItem)`
  color: grey;
`
