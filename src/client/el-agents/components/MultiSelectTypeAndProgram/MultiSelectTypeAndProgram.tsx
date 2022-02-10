import * as React from 'react'
import { MultiSelectCourseCategoryByTaxonomy, IMultiSelectTaxonomyData } from '../MultiSelectCourseCategoryByTaxonomy'

export interface IMultiSelectTypeAndProgramProps {
  selectedTypeContentIds: number[]
  selectedProgramContentIds: number[]
  restrictedToTypeContentIds?: number[]
  onChange: (taxonomiesData: IMultiSelectTaxonomyData[]) => void
}

export function MultiSelectTypeAndProgram(props: IMultiSelectTypeAndProgramProps) {

  const taxonomiesData: IMultiSelectTaxonomyData[] = [{
    selectedContentIds: props.selectedTypeContentIds,
    restrictedToContentIds: props.restrictedToTypeContentIds,
    taxonomyId: 1,
    placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
  },
  {
    selectedContentIds: props.selectedProgramContentIds,
    taxonomyId: 2,
    placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
  }]

  const onChange = (taxonomiesData: IMultiSelectTaxonomyData[]) => {
    props.onChange(taxonomiesData)
  }

  return (
    <MultiSelectCourseCategoryByTaxonomy
      onChange={onChange}
      taxonomiesData={taxonomiesData}
    />
  )
}
