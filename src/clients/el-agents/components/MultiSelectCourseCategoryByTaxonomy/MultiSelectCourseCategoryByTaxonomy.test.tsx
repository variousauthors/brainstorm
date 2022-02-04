import React from 'react'
import { fireEvent, render, screen, waitForElementToBeRemoved, waitFor, server } from '@src/test-utils'
import { mock } from './hooks/useQueryCourseCategories'
import { IMultiSelectTaxonomyData, MultiSelectCourseCategoryByTaxonomy } from './MultiSelectCourseCategoryByTaxonomy'

const taxonomiesData: IMultiSelectTaxonomyData[] = [{
  selectedContentIds: [],
  taxonomyId: 1,
  placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
},
{
  selectedContentIds: [],
  taxonomyId: 2,
  placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
}]

const mockQuery = mock({
  offeringCourseCategories: [
    {
      codeName: 'LANGUAGES',
      depth: 0,
      left: 1,
      offeringCourseCategoryContent: {
        offeringCourseCategoryContentId: 118,
        codeName: 'LANGUAGES',
      },
      offeringCourseCategoryContentId: 118,
      offeringCourseCategoryId: 1,
      offeringCourseCategoryTaxonomyId: 1,
      right: 408,
    },
    {
      codeName: 'ENGLISH',
      depth: 1,
      left: 2,
      offeringCourseCategoryContent: {
        offeringCourseCategoryContentId: 61,
        codeName: 'ENGLISH',
      },
      offeringCourseCategoryContentId: 61,
      offeringCourseCategoryId: 2,
      offeringCourseCategoryTaxonomyId: 1,
      right: 25,
    },
    {
      codeName: 'GENERAL_ENGLISH',
      depth: 2,
      left: 3,
      offeringCourseCategoryContent: {
        offeringCourseCategoryContentId: 165,
        codeName: 'GENERAL',
      },
      offeringCourseCategoryContentId: 165,
      offeringCourseCategoryId: 3,
      offeringCourseCategoryTaxonomyId: 2,
      right: 4,
    },
  ],
})

test('Clicking into the course type select opens the dropdown', async () => {
  server.use(mockQuery)

  render(
    <MultiSelectCourseCategoryByTaxonomy
      onChange={jest.fn}
      taxonomiesData={taxonomiesData}
    />,
  )

  await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

  const control = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

  fireEvent.click(control)

  const dropdown = await screen.findByRole('listbox')

  await waitFor(() => {
    expect(dropdown).toBeDefined()
  })
})

test('shows a progress bar while it does not have data', () => {
  server.use(mockQuery)

  render(
    <MultiSelectCourseCategoryByTaxonomy
      onChange={jest.fn}
      taxonomiesData={taxonomiesData}
    />,
  )

  expect(screen.getByRole('progressbar'))
})

test('clicking into a course type loads the relevant labels', async () => {
  server.use(mockQuery)

  render(
    <MultiSelectCourseCategoryByTaxonomy
      onChange={jest.fn}
      taxonomiesData={taxonomiesData}
    />,
  )

  await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

  fireEvent.click(screen.getByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE'))

  await screen.findByRole('option')

  expect(screen.getByText('OFFERING.COURSE.CATEGORY.ENGLISH'))
})

test('clicking a course type fires the call back', async () => {
  server.use(mockQuery)

  const onChange = jest.fn()

  render(
    <MultiSelectCourseCategoryByTaxonomy
      onChange={onChange}
      taxonomiesData={taxonomiesData}
    />,
  )

  await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

  fireEvent.click(screen.getByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE'))

  await screen.findByRole('option')

  fireEvent.click(screen.getByText('OFFERING.COURSE.CATEGORY.ENGLISH'))

  expect(onChange).toBeCalledWith([
    {
      placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
      selectedContentIds: [61],
      taxonomyId: 1,
    }, {
      placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
      selectedContentIds: [],
      taxonomyId: 2,
    },
  ])
})