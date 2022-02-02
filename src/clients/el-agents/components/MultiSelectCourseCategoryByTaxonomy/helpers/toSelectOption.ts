import { ISelectOption } from '@atoms/metadata'
import { IInputMultiSelectOption } from './leftRightTreeParser'

export function toSelectOption (courseCategory: IInputMultiSelectOption<number>): ISelectOption {
  return {
    label: `OFFERING.COURSE.CATEGORY.${courseCategory.name}`,
    value: courseCategory.id,
  }
}
