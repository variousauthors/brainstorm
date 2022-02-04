import React from 'react'
import { fireEvent, render, screen, server } from '@src/test-utils'
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

const LANGUAGES = 118
const ENGLISH = 61
const CHINESE = 100
const GENERAL = 165
const BUSINESS = 99

const mockData = [
  {
    codeName: 'LANGUAGES',
    depth: 0,
    offeringCourseCategoryContent: {
      offeringCourseCategoryContentId: LANGUAGES,
      codeName: 'LANGUAGES',
    },
    offeringCourseCategoryContentId: LANGUAGES,
    offeringCourseCategoryId: 1,
    offeringCourseCategoryTaxonomyId: 1,
    left: 1,
    right: 408,
  },
  {
    codeName: 'ENGLISH',
    depth: 1,
    offeringCourseCategoryContent: {
      offeringCourseCategoryContentId: ENGLISH,
      codeName: 'ENGLISH',
    },
    offeringCourseCategoryContentId: ENGLISH,
    offeringCourseCategoryId: 2,
    offeringCourseCategoryTaxonomyId: 1,
    left: 2,
    right: 25,
  },
  {
    codeName: 'GENERAL_ENGLISH',
    depth: 2,
    offeringCourseCategoryContent: {
      offeringCourseCategoryContentId: GENERAL,
      codeName: 'GENERAL',
    },
    offeringCourseCategoryContentId: GENERAL,
    offeringCourseCategoryId: 3,
    offeringCourseCategoryTaxonomyId: 2,
    left: 3,
    right: 4,
  },
  {
    codeName: 'CHINESE',
    depth: 1,
    offeringCourseCategoryContent: {
      offeringCourseCategoryContentId: CHINESE,
      codeName: 'CHINESE',
    },
    offeringCourseCategoryContentId: CHINESE,
    offeringCourseCategoryId: 4,
    offeringCourseCategoryTaxonomyId: 1,
    left: 26,
    right: 60,
  },
  {
    codeName: 'BUSINESS_CHINESE',
    depth: 2,
    offeringCourseCategoryContent: {
      offeringCourseCategoryContentId: BUSINESS,
      codeName: 'BUSINESS',
    },
    offeringCourseCategoryContentId: BUSINESS,
    offeringCourseCategoryId: 5,
    offeringCourseCategoryTaxonomyId: 2,
    left: 27,
    right: 28,
  },
]

const mockQuery = mock({
  offeringCourseCategories: [
    ...mockData,
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

  const control = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

  fireEvent.click(control)

  const dropdown = await screen.findByRole('listbox')

  expect(dropdown).toBeDefined()
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

describe('type options', () => {
  test('the type dropdown only includes types', async () => {
    server.use(mockQuery)

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={taxonomiesData}
      />,
    )

    await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

    fireEvent.click(screen.getByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE'))

    await screen.findByRole('listbox')

    const general = screen.queryByRole('option', { name: /GENERAL/i })

    expect(general).not.toBeInTheDocument()
  })

  test('the type dropdown only includes direct parents of categories', async () => {
    server.use(mockQuery)

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={taxonomiesData}
      />,
    )

    await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

    fireEvent.click(screen.getByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE'))

    await screen.findByRole('listbox')

    const english = screen.queryByRole('option', { name: /ENGLISH/i})
    const languages = screen.queryByRole('option', { name: /LANGUAGES/i})

    expect(english).toBeInTheDocument()
    expect(languages).not.toBeInTheDocument()
  })

  test('the type dropdown does not include types with no children', async () => {
    server.use(mock({
      offeringCourseCategories: [
        ...mockData,
        {
          codeName: 'MAGIC',
          depth: 0,
          offeringCourseCategoryContent: {
            offeringCourseCategoryContentId: 999,
            codeName: 'MAGIC',
          },
          offeringCourseCategoryContentId: 999,
          offeringCourseCategoryId: 999,
          offeringCourseCategoryTaxonomyId: 1,
          left: 409,
          right: 1000,
        },
      ],
    }))

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={taxonomiesData}
      />,
    )

    await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

    fireEvent.click(screen.getByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE'))

    await screen.findByRole('listbox')

    const MAGIC = screen.queryByRole('option', { name: /MAGIC/i})

    expect(MAGIC).not.toBeInTheDocument()
  })

  test('clicking a type fires the callback', async () => {
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

    await screen.findByRole('option', { name: /ENGLISH/i })

    fireEvent.click(screen.getByText('OFFERING.COURSE.CATEGORY.ENGLISH'))

    expect(onChange).toBeCalledWith([
      {
        placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
        selectedContentIds: [ENGLISH],
        taxonomyId: 1,
      }, {
        placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
        selectedContentIds: [],
        taxonomyId: 2,
      },
    ])
  })
})

describe('the programs', () => {
  const taxonomiesData = [
    {
      placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
      selectedContentIds: [ENGLISH],
      taxonomyId: 1,
    }, {
      placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
      selectedContentIds: [],
      taxonomyId: 2,
    },
  ]

  test('the program dropdown only includes program', async () => {
    server.use(mockQuery)

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={taxonomiesData}
      />,
    )

    const PROGRAM = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM')

    fireEvent.click(PROGRAM)

    await screen.findByRole('listbox')

    const languages = screen.queryByRole('option', { name: /LANGUAGES/i })
    const english = screen.queryByRole('option', { name: /ENGLISH/i })

    expect(languages).not.toBeInTheDocument()
    expect(english).not.toBeInTheDocument()
  })

  test('if you choose the English type you should not see Business Chinese', async () => {
    server.use(mock({
      offeringCourseCategories: [
        ...mockData,
      ],
    }))

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={taxonomiesData}
      />,
    )

    const PROGRAM = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM')

    fireEvent.click(PROGRAM)

    await screen.findByRole('listbox')

    const business = screen.queryByRole('option', { name: /BUSINESS/i})

    expect(business).not.toBeInTheDocument()
  })

  test('if you select English and Chinese you will see GENERAL only once', async () => {
    server.use(mock({
      offeringCourseCategories: [
        ...mockData,
        {
          codeName: 'GENERAL_ENGLISH',
          depth: 2,
          offeringCourseCategoryContent: {
            offeringCourseCategoryContentId: GENERAL,
            codeName: 'GENERAL',
          },
          offeringCourseCategoryContentId: GENERAL,
          offeringCourseCategoryId: 3,
          offeringCourseCategoryTaxonomyId: 2,
          left: 3,
          right: 4,
        },
        {
          codeName: 'GENERAL_CHINESE',
          depth: 2,
          offeringCourseCategoryContent: {
            offeringCourseCategoryContentId: GENERAL,
            codeName: 'GENERAL',
          },
          offeringCourseCategoryContentId: GENERAL,
          offeringCourseCategoryId: 9999,
          offeringCourseCategoryTaxonomyId: 2,
          left: 29,
          right: 30,
        },
      ],
    }))

    const taxonomiesData = [
      {
        placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
        selectedContentIds: [ENGLISH, CHINESE],
        taxonomyId: 1,
      }, {
        placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
        selectedContentIds: [],
        taxonomyId: 2,
      },
    ]

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={taxonomiesData}
      />,
    )

    const PROGRAM = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM')

    fireEvent.click(PROGRAM)

    await screen.findByRole('listbox')

    const general = screen.queryAllByRole('option', { name: /GENERAL/i})

    expect(general).toHaveLength(1)
  })

  test('clicking a program fires the callback', async () => {
    server.use(mockQuery)

    const onChange = jest.fn()

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={onChange}
        taxonomiesData={taxonomiesData}
      />,
    )

    const PROGRAM = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM')

    fireEvent.click(PROGRAM)

    await screen.findByRole('listbox')

    const general = await screen.findByRole('option', { name: /GENERAL/i})

    fireEvent.click(general)

    expect(onChange).toBeCalledWith([
      {
        placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
        selectedContentIds: [ENGLISH],
        taxonomyId: 1,
      }, {
        placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
        selectedContentIds: [GENERAL],
        taxonomyId: 2,
      },
    ])
  })
})

describe('restricted to content ids', () => {
  test('the type dropdown does not include types from the restrictedToContentIds', async () => {
    server.use(mockQuery)

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={[{
          selectedContentIds: [],
          taxonomyId: 1,
          placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
          restrictedToContentIds: [ENGLISH],
        },
        {
          selectedContentIds: [],
          taxonomyId: 2,
          placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
        }]}
      />,
    )

    const TYPE = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_TYPE')

    fireEvent.click(TYPE)

    await screen.findByRole('listbox')

    const chinese = screen.queryByRole('option', { name: /CHINESE/i })

    expect(chinese).not.toBeInTheDocument()
  })

  test('the program dropdown does not include types from the restrictedToContentIds', async () => {
    server.use(mockQuery)

    render(
      <MultiSelectCourseCategoryByTaxonomy
        onChange={jest.fn}
        taxonomiesData={[{
          selectedContentIds: [ENGLISH, CHINESE],
          taxonomyId: 1,
          placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_TYPE',
        },
        {
          selectedContentIds: [],
          taxonomyId: 2,
          placeholder: 'BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM',
          restrictedToContentIds: [GENERAL],
        }]}
      />,
    )

    const PROGRAM = await screen.findByText('BROWSE.SCHOOLS.ENTER_COURSE_PROGRAM')

    fireEvent.click(PROGRAM)

    await screen.findByRole('listbox')

    const general = screen.queryByRole('option', { name: /GENERAL/i })
    const business = screen.queryByRole('option', { name: /BUSINESS/i })

    expect(business).not.toBeInTheDocument()
    expect(general).toBeInTheDocument()
  })
})