import { ISelectOption } from '@atoms/metadata'

export type ILayeredMenuDropdownMenuItem = {
  submenu?: ILayeredMenuDropdownMenu
} & ISelectOption

export type ILayeredMenuDropdownMenu = ILayeredMenuDropdownMenuItem[]
