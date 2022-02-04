import { defaultTo, isEmpty, isNil, sortBy } from '@atoms/helpers'
import { ILayeredMenuDropdownMenu, ILayeredMenuDropdownMenuItem } from '../metadata'
import { IInputMultiSelectOption } from './leftRightTreeParser'
import { toSelectOption } from './toSelectOption'

export const createMenuItemsFromNestedOptions = (nestedOptions: IInputMultiSelectOption<number>[]): ILayeredMenuDropdownMenu => {
  const result = nestedOptions.map<ILayeredMenuDropdownMenuItem>((option) => {
    if (isNil(option.children) || isEmpty(option.children)) {
      return toSelectOption(option)
    } else {
      return {
        ...toSelectOption(option),
        submenu: createMenuItemsFromNestedOptions(option.children),
      }
    }
  })
  return result
}

/**
 * sort in an order defined by us
 *
 * This is intended for the root programs.
 * order defined from top to bottom
 * this list was generated manually by number of courses under each root program, highest to lowest
 * Anything not defined is placed lowest
 */
const RootProgramOrderDefinition = [
  'BUSINESS,MARKETING,MANAGEMENT',
  'MEDICINE,HEALTH,SPORTS',
  'ART_DIGITAL_MEDIA_AND_DESIGN',
  'ENGINEERING,TECHNOLOGY',
  'HOSPITALITY_AND_TOURISM',
  'COMPUTER_SCIENCE,IT',
  'HUMANITIES,SOCIAL_SCIENCES',
  'APPLIED_SCIENCES,MATHEMATICS',
  'EDUCATION,TRAINING',
  'ACCOUNTING,ECONOMICS,FINANCE',
  'COMMUNITY_SERVICES',
  'FASHION_AND_BEAUTY',
  'LAW',
  'AGRICULTURE,FORESTRY',
  'PERFORMING_ARTS',
  'INTERNATIONAL_FOUNDATION',
  'INTERNSHIP',
  'VOLUNTEER',
]
const RootProgramOrderWeightDict = RootProgramOrderDefinition.reduce<{[key: string]: number}>((dict, codeName, index) => {
  dict[codeName] = index
  return dict
}, {})
const ramdaSortByFn = (option: IInputMultiSelectOption) => defaultTo(99999, RootProgramOrderWeightDict[option.name])
export const sortNestedOptionsCourseCategoryRootPrograms = (nestedOptions: IInputMultiSelectOption<number>[]): IInputMultiSelectOption<number>[] => {
  return sortBy(nestedOptions, ramdaSortByFn)
}
